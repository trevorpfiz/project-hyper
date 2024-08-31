import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { z } from "zod";

import { and, desc, eq, gte, lte } from "@hyper/db";
import { CGMData, Profile } from "@hyper/db/schema";
import {
  DataRangeResponseSchema,
  DevicesResponseSchema,
  EGVsResponseSchema,
} from "@hyper/validators/dexcom";

import { protectedDexcomProcedure, protectedProcedure } from "../trpc";
import {
  DateRangeSchema,
  DEXCOM_SANDBOX_BASE_URL,
  exchangeAuthorizationCode,
  fetchDexcomData,
} from "../utils/dexcom";

export const dexcomRouter = {
  authorize: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      const tokenData = await exchangeAuthorizationCode(input.code);
      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      };
    }),

  fetchAndStoreEGVs: protectedDexcomProcedure
    .input(DateRangeSchema)
    .mutation(async ({ input, ctx }) => {
      const { dexcomTokens } = ctx;

      console.log("Original input date range:", input);

      // Format dates to remove milliseconds and use the correct format
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "yyyy-MM-dd'T'HH:mm:ss");
      };

      const formattedStartDate = formatDate(input.startDate);
      const formattedEndDate = formatDate(input.endDate);

      console.log("Formatted date range:", {
        formattedStartDate,
        formattedEndDate,
      });

      // Construct query parameters
      const query = new URLSearchParams({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }).toString();

      const url = `${DEXCOM_SANDBOX_BASE_URL}/v3/users/self/egvs?${query}`;

      console.log("Fetching data from:", url);

      // Fetch and validate the response
      const validatedData = await fetchDexcomData(
        url,
        dexcomTokens.accessToken,
        EGVsResponseSchema,
      );

      // Prepare bulk insert data
      const cgmDataToInsert = validatedData.records.map((egv) => ({
        dexcomUserId: validatedData.userId,
        recordId: egv.recordId,
        systemTime: new Date(egv.systemTime),
        displayTime: new Date(egv.displayTime),
        transmitterId: egv.transmitterId,
        transmitterTicks: egv.transmitterTicks,
        glucoseValue: egv.value,
        status: egv.status,
        trend: egv.trend,
        trendRate: egv.trendRate,
        unit: egv.unit,
        rateUnit: egv.rateUnit,
        displayDevice: egv.displayDevice,
        transmitterGeneration: egv.transmitterGeneration,
        profileId: ctx.user.id,
      }));

      if (cgmDataToInsert.length === 0 || !cgmDataToInsert[0]) {
        return {
          recordsInserted: 0,
          dateRange: null,
          latestEGVTimestamp: null,
        };
      }

      // Perform bulk insert
      await ctx.db.insert(CGMData).values(cgmDataToInsert);

      // Calculate the actual date range of inserted data
      const actualStartDate = cgmDataToInsert.reduce(
        (min, egv) => (egv.systemTime < min ? egv.systemTime : min),
        cgmDataToInsert[0].systemTime,
      );
      const actualEndDate = cgmDataToInsert.reduce(
        (max, egv) => (egv.systemTime > max ? egv.systemTime : max),
        cgmDataToInsert[0].systemTime,
      );

      return {
        recordsInserted: cgmDataToInsert.length,
        dateRange: {
          start: actualStartDate.toISOString(),
          end: actualEndDate.toISOString(),
        },
        latestEGVTimestamp: actualEndDate.toISOString(),
      };
    }),

  getStoredEGVs: protectedProcedure
    .input(DateRangeSchema)
    .query(async ({ input, ctx }) => {
      const storedData = await ctx.db
        .select()
        .from(CGMData)
        .where(
          and(
            gte(CGMData.displayTime, new Date(input.startDate)),
            lte(CGMData.displayTime, new Date(input.endDate)),
            eq(CGMData.profileId, ctx.user.id),
          ),
        )
        .orderBy(desc(CGMData.displayTime));

      return storedData;
    }),

  fetchDevices: protectedDexcomProcedure.query(async ({ ctx }) => {
    const { dexcomTokens } = ctx;

    const url = `${DEXCOM_SANDBOX_BASE_URL}/v3/users/self/devices`;

    const validatedData = await fetchDexcomData(
      url,
      dexcomTokens.accessToken,
      DevicesResponseSchema,
    );

    return { devices: validatedData.records };
  }),

  fetchDataRange: protectedDexcomProcedure
    .input(z.object({ lastSyncTime: z.string().datetime().optional() }))
    .query(async ({ input, ctx }) => {
      const { dexcomTokens } = ctx;

      const query = new URLSearchParams();
      if (input.lastSyncTime) {
        query.append("lastSyncTime", input.lastSyncTime);
      }

      const url = `${DEXCOM_SANDBOX_BASE_URL}/v3/users/self/dataRange${query.toString() ? `?${query.toString()}` : ""}`;

      const validatedData = await fetchDexcomData(
        url,
        dexcomTokens.accessToken,
        DataRangeResponseSchema,
      );

      return validatedData;
    }),

  syncEGVs: protectedDexcomProcedure.mutation(async ({ ctx }) => {
    const { dexcomTokens, user, db } = ctx;

    // Fetch the user's profile to get the last synced time
    const profile = await db.query.Profile.findFirst({
      where: eq(Profile.id, user.id),
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User profile not found",
      });
    }

    // Fetch the data range
    const dataRangeQuery = new URLSearchParams();
    if (profile.lastSyncedTime) {
      dataRangeQuery.append(
        "lastSyncTime",
        profile.lastSyncedTime.toISOString(),
      );
    }
    const dataRangeUrl = `${DEXCOM_SANDBOX_BASE_URL}/v3/users/self/dataRange${dataRangeQuery.toString() ? `?${dataRangeQuery.toString()}` : ""}`;

    const dataRange = await fetchDexcomData(
      dataRangeUrl,
      dexcomTokens.accessToken,
      DataRangeResponseSchema,
    );

    // Check if there are new EGVs to sync
    if (!dataRange.egvs) {
      return { success: true, message: "No new EGVs to sync" };
    }

    // Fetch EGVs
    const egvsUrl = `${DEXCOM_SANDBOX_BASE_URL}/v3/users/self/egvs?startDate=${dataRange.egvs.start.systemTime}&endDate=${dataRange.egvs.end.systemTime}`;
    const egvsData = await fetchDexcomData(
      egvsUrl,
      dexcomTokens.accessToken,
      EGVsResponseSchema,
    );

    // Prepare EGVs for insertion
    const egvsToInsert = egvsData.records.map((egv) => ({
      dexcomUserId: egvsData.userId,
      recordId: egv.recordId,
      systemTime: new Date(egv.systemTime),
      displayTime: new Date(egv.displayTime),
      transmitterId: egv.transmitterId,
      transmitterTicks: egv.transmitterTicks,
      glucoseValue: egv.value,
      status: egv.status,
      trend: egv.trend,
      trendRate: egv.trendRate,
      unit: egv.unit,
      rateUnit: egv.rateUnit,
      displayDevice: egv.displayDevice,
      transmitterGeneration: egv.transmitterGeneration,
      profileId: user.id,
    }));

    // Insert EGVs into the database
    await db.insert(CGMData).values(egvsToInsert);

    // Update the last synced time
    await db
      .update(Profile)
      .set({ lastSyncedTime: new Date() })
      .where(eq(Profile.id, user.id));

    return { success: true, message: "EGVs synced successfully" };
  }),
} satisfies TRPCRouterRecord;

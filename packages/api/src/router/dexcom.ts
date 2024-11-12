import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";
import { z } from "zod";

import { and, desc, eq, gte, lte } from "@stable/db";
import { CGMData, Profile } from "@stable/db/schema";
import {
  DataRangeResponseSchema,
  DevicesResponseSchema,
  EGVsResponseSchema,
} from "@stable/validators/dexcom";

import { protectedDexcomProcedure, protectedProcedure } from "../trpc";
import { getDateChunks } from "../utils";
import {
  DateRangeSchema,
  DEXCOM_SANDBOX_BASE_URL,
  exchangeAuthorizationCode,
  fetchDexcomData,
} from "../utils/dexcom";
import { conflictUpdateAllExcept } from "../utils/drizzle";

export const dexcomRouter = {
  authorize: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      console.log("testatdsdsdsdgssdg", input.code);

      const tokenData = await exchangeAuthorizationCode(input.code);

      console.log("tokenData", tokenData);

      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      };
    }),

  fetchDataRange: protectedDexcomProcedure
    .input(z.object({ lastSyncTime: z.string().datetime().optional() }))
    .query(async ({ input, ctx }) => {
      const { dexcomTokens } = ctx;

      const query = new URLSearchParams();
      if (input.lastSyncTime) {
        const lastSyncDateTime = DateTime.fromISO(input.lastSyncTime);

        if (!lastSyncDateTime.isValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid last sync time.",
          });
        }

        query.append("lastSyncTime", lastSyncDateTime.toUTC().toISO());
      }

      const url = `${DEXCOM_SANDBOX_BASE_URL}/v3/users/self/dataRange${query.toString() ? `?${query.toString()}` : ""}`;

      const validatedData = await fetchDexcomData(
        url,
        dexcomTokens.accessToken,
        DataRangeResponseSchema,
      );

      return validatedData;
    }),

  fetchAndStoreEGVs: protectedDexcomProcedure
    .input(DateRangeSchema)
    .mutation(async ({ input, ctx }) => {
      const { dexcomTokens, db } = ctx;

      const startDate = DateTime.fromISO(input.startDate).toUTC();
      const endDate = DateTime.fromISO(input.endDate).toUTC();

      if (!startDate.isValid || !endDate.isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid date range provided.",
        });
      }

      const chunks = getDateChunks(startDate, endDate);
      console.log("Chunks:", chunks);
      let totalRecordsInserted = 0;
      let latestEGVTimestamp: string | null = null;

      for (const chunk of chunks) {
        const query = new URLSearchParams({
          startDate: chunk.start,
          endDate: chunk.end,
        }).toString();

        const url = `${DEXCOM_SANDBOX_BASE_URL}/v3/users/self/egvs?${query}`;
        // Fetch and validate the response
        const validatedData = await fetchDexcomData(
          url,
          dexcomTokens.accessToken,
          EGVsResponseSchema,
        );

        const cgmDataToUpsert = validatedData.records.map((egv) => ({
          dexcomUserId: validatedData.userId,
          recordId: egv.recordId,
          systemTime: DateTime.fromISO(egv.systemTime).toJSDate(),
          displayTime: DateTime.fromISO(egv.displayTime).toJSDate(),
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

        // Use an upsert operation to handle potential duplicates
        const result = await db
          .insert(CGMData)
          .values(cgmDataToUpsert)
          .onConflictDoUpdate({
            target: CGMData.recordId,
            set: conflictUpdateAllExcept(CGMData, [
              "id",
              "recordId",
              "dexcomUserId",
              "createdAt",
              "updatedAt",
            ]),
          })
          .returning();
        const recordsAffected = result.length;
        totalRecordsInserted += recordsAffected;

        // Sort the result array to find the latest systemTime
        const sortedResult = result.sort(
          (a, b) => b.systemTime.getTime() - a.systemTime.getTime(),
        );
        const latestRecord = sortedResult[0];

        if (latestRecord) {
          latestEGVTimestamp = DateTime.fromJSDate(
            latestRecord.systemTime,
          ).toISO();
        }
      }

      return {
        recordsInserted: totalRecordsInserted,
        dateRange: {
          start: startDate.toISO(),
          end: endDate.toISO(),
        },
        latestEGVTimestamp,
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
            gte(CGMData.systemTime, new Date(input.startDate)),
            lte(CGMData.systemTime, new Date(input.endDate)),
            eq(CGMData.profileId, ctx.user.id),
          ),
        )
        .orderBy(desc(CGMData.systemTime));

      return storedData;
    }),

  getLatestEGV: protectedProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    console.log("user", user);

    const row = await db.query.CGMData.findFirst({
      where: eq(CGMData.profileId, user.id),
      orderBy: desc(CGMData.systemTime),
    });

    console.log("row", row);

    return { egv: row };
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

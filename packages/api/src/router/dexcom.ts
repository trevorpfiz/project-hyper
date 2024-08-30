import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq, gte, lte } from "@hyper/db";
import { CGMData } from "@hyper/db/schema";
import {
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

      const url = `${DEXCOM_SANDBOX_BASE_URL}/v3/users/self/egvs?startDate=${input.startDate}&endDate=${input.endDate}`;

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

      // Perform bulk insert
      await ctx.db.insert(CGMData).values(cgmDataToInsert);

      return { success: true };
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
} satisfies TRPCRouterRecord;

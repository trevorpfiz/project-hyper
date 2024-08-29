import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { CGMData } from "@hyper/db/schema";
import { EGVsResponseSchema } from "@hyper/validators/dexcom";

import type { TokenData } from "../utils/dexcom";
import { protectedProcedure, publicProcedure } from "../trpc";
import {
  DEXCOM_SANDBOX_BASE_URL,
  exchangeAuthorizationCode,
  fetchDexcomData,
  refreshAccessToken,
  refreshTokenIfNeeded,
} from "../utils/dexcom";

export const dexcomRouter = {
  authorize: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      const tokenData = await exchangeAuthorizationCode(input.code);
      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      };
    }),

  refreshToken: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(async ({ input }) => {
      const tokenData = await refreshAccessToken(input.refreshToken);
      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      };
    }),

  fetchEGVs: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
        tokenExpiresAt: z.number(),
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      let tokens: TokenData = {
        accessToken: input.accessToken,
        refreshToken: input.refreshToken,
        expiresAt: input.tokenExpiresAt,
      };

      tokens = await refreshTokenIfNeeded(tokens);

      const url = `${DEXCOM_SANDBOX_BASE_URL}/v3/users/self/egvs?startDate=${input.startDate}&endDate=${input.endDate}`;

      // Fetch and validate the response
      const validatedData = await fetchDexcomData(
        url,
        tokens.accessToken,
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
        value: egv.value,
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

      return {
        cgmData: validatedData,
        newTokens: tokens,
      };
    }),
} satisfies TRPCRouterRecord;

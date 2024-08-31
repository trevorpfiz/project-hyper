import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";
import { refreshAccessToken } from "../utils/dexcom";

export const authRouter = {
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),

  // TODO: can potentially make this a protected procedure by creating a helper TRPCProvider that includes supabase auth and we use that in token-refresh.ts
  refreshDexcomToken: publicProcedure.mutation(async ({ ctx }) => {
    const { dexcomTokens } = ctx;

    if (!dexcomTokens) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Dexcom authentication required",
      });
    }

    const refreshedTokens = await refreshAccessToken(dexcomTokens.refreshToken);
    return {
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token,
      expiresIn: refreshedTokens.expires_in, // Keep this as seconds
    };
  }),
} satisfies TRPCRouterRecord;

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { OAuthTokenResponse } from "@hyper/validators/dexcom";
import {
  OAuthErrorResponseSchema,
  OAuthTokenResponseSchema,
} from "@hyper/validators/dexcom";

export const TokenDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
});
export type TokenData = z.infer<typeof TokenDataSchema>;

export const DEXCOM_SANDBOX_BASE_URL = "https://sandbox-api.dexcom.com";

export async function refreshAccessToken(refreshToken: string) {
  return exchangeToken({
    client_id: process.env.NEXT_PUBLIC_DEXCOM_CLIENT_ID ?? "",
    client_secret: process.env.DEXCOM_CLIENT_SECRET ?? "",
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
}

export async function exchangeToken(params: {
  client_id: string;
  client_secret: string;
  code?: string;
  refresh_token?: string;
  grant_type: "authorization_code" | "refresh_token";
  redirect_uri?: string;
}): Promise<OAuthTokenResponse> {
  const response = await fetch(`${DEXCOM_SANDBOX_BASE_URL}/v2/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params).toString(),
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    const errorResult = OAuthErrorResponseSchema.safeParse(data);
    if (errorResult.success) {
      const errorData = errorResult.data;
      throw new TRPCError({
        code: response.status === 401 ? "UNAUTHORIZED" : "BAD_REQUEST",
        message:
          errorData.error_description ?? `OAuth error: ${errorData.error}`,
      });
    } else {
      // If the error doesn't match the OAuth error schema, fall back to a generic error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to exchange token",
      });
    }
  }

  const result = OAuthTokenResponseSchema.safeParse(data);
  if (!result.success) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to parse OAuth token response",
    });
  }

  return result.data;
}

export async function refreshTokenIfNeeded(
  tokens: TokenData,
): Promise<TokenData | null> {
  const now = Date.now();
  if (tokens.expiresAt - now < 300000) {
    // 5 minutes
    const refreshedData = await refreshAccessToken(tokens.refreshToken);
    return {
      accessToken: refreshedData.access_token,
      refreshToken: refreshedData.refresh_token,
      expiresAt: now + refreshedData.expires_in * 1000,
    };
  }
  return null;
}

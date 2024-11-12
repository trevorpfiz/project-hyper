import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { OAuthTokenResponse } from "@stable/validators/dexcom";
import {
  OAuthErrorResponseSchema,
  OAuthTokenResponseSchema,
} from "@stable/validators/dexcom";

export const TokenDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
});
export type TokenData = z.infer<typeof TokenDataSchema>;

export const DateRangeSchema = z.object({
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }),
});
export type DateRange = z.infer<typeof DateRangeSchema>;

export const DEXCOM_SANDBOX_BASE_URL = "https://sandbox-api.dexcom.com";
export const DEXCOM_BASE_URL = "https://api.dexcom.com";

export async function exchangeAuthorizationCode(code: string) {
  return exchangeToken({
    client_id: process.env.NEXT_PUBLIC_DEXCOM_CLIENT_ID ?? "",
    client_secret: process.env.DEXCOM_CLIENT_SECRET ?? "",
    code,
    grant_type: "authorization_code",
    redirect_uri: "expo:///(app)/(tabs)/account",
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

/**
 * Fetches and validates data from the Dexcom API.
 * @param url - The API endpoint URL.
 * @param accessToken - The OAuth access token.
 * @param schema - The Zod schema to validate the response against.
 * @returns The validated data with the correct TypeScript type.
 * @throws {TRPCError} Throws an error if the fetch fails or validation fails.
 */
export async function fetchDexcomData<T extends z.ZodTypeAny>(
  url: string,
  accessToken: string,
  schema: T,
): Promise<z.infer<T>> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Access token expired",
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `${response.statusText} (${response.status})`,
    });
  }

  const data: unknown = await response.json();
  console.log("data", data);

  // Validate the data against the provided schema
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to parse data from Dexcom: ${result.error.message}`,
    });
  }

  // Return the validated data with the correct type
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result.data as z.infer<T>;
}

export async function refreshAccessToken(refreshToken: string) {
  return exchangeToken({
    client_id: process.env.NEXT_PUBLIC_DEXCOM_CLIENT_ID ?? "",
    client_secret: process.env.DEXCOM_CLIENT_SECRET ?? "",
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
}

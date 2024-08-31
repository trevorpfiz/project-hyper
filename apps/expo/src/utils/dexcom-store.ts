import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "dexcom_access_token";
const REFRESH_TOKEN_KEY = "dexcom_refresh_token";
const TOKEN_EXPIRY_KEY = "dexcom_token_expiry";
const REFRESH_TOKEN_CREATED_KEY = "dexcom_refresh_token_created";

export interface DexcomTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  refreshTokenCreated: number;
}

export const getDexcomTokens = (): DexcomTokens | null => {
  const accessToken = SecureStore.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = SecureStore.getItem(REFRESH_TOKEN_KEY);
  const expiresAtStr = SecureStore.getItem(TOKEN_EXPIRY_KEY);
  const refreshTokenCreatedStr = SecureStore.getItem(REFRESH_TOKEN_CREATED_KEY);

  if (accessToken && refreshToken && expiresAtStr && refreshTokenCreatedStr) {
    return {
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAtStr, 10),
      refreshTokenCreated: parseInt(refreshTokenCreatedStr, 10),
    };
  }
  return null;
};

export const setDexcomTokens = (tokens: DexcomTokens): void => {
  SecureStore.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  SecureStore.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  SecureStore.setItem(TOKEN_EXPIRY_KEY, tokens.expiresAt.toString());
  SecureStore.setItem(
    REFRESH_TOKEN_CREATED_KEY,
    tokens.refreshTokenCreated.toString(),
  );
};

export const deleteDexcomTokens = async (): Promise<void> => {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_CREATED_KEY),
  ]);
};

export const isAccessTokenExpired = (): boolean => {
  const expiresAtStr = SecureStore.getItem(TOKEN_EXPIRY_KEY);
  if (!expiresAtStr) return true;
  const expiresAt = parseInt(expiresAtStr, 10);
  return Date.now() >= expiresAt;
};

export const isRefreshTokenExpired = (): boolean => {
  const refreshTokenCreatedStr = SecureStore.getItem(REFRESH_TOKEN_CREATED_KEY);
  if (!refreshTokenCreatedStr) return true;
  const refreshTokenCreated = parseInt(refreshTokenCreatedStr, 10);
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
  return Date.now() >= refreshTokenCreated + oneYearInMs;
};

export const updateDexcomTokens = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number, // This is in seconds
): void => {
  const now = Date.now();
  const expiresAt = now + expiresIn * 1000; // Convert seconds to milliseconds
  const refreshTokenCreated = now;

  setDexcomTokens({
    accessToken,
    refreshToken,
    expiresAt,
    refreshTokenCreated,
  });
};

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

export const getDexcomTokens = async (): Promise<DexcomTokens | null> => {
  const [accessToken, refreshToken, expiresAtStr, refreshTokenCreatedStr] =
    await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.getItemAsync(TOKEN_EXPIRY_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_CREATED_KEY),
    ]);

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

export const setDexcomTokens = async (tokens: DexcomTokens): Promise<void> => {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
    SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, tokens.expiresAt.toString()),
    SecureStore.setItemAsync(
      REFRESH_TOKEN_CREATED_KEY,
      tokens.refreshTokenCreated.toString(),
    ),
  ]);
};

export const deleteDexcomTokens = async (): Promise<void> => {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_CREATED_KEY),
  ]);
};

export const isAccessTokenExpired = async (): Promise<boolean> => {
  const expiresAtStr = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);
  if (!expiresAtStr) return true;
  const expiresAt = parseInt(expiresAtStr, 10);
  return Date.now() >= expiresAt;
};

export const isRefreshTokenExpired = async (): Promise<boolean> => {
  const refreshTokenCreatedStr = await SecureStore.getItemAsync(
    REFRESH_TOKEN_CREATED_KEY,
  );
  if (!refreshTokenCreatedStr) return true;
  const refreshTokenCreated = parseInt(refreshTokenCreatedStr, 10);
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
  return Date.now() >= refreshTokenCreated + oneYearInMs;
};

export const updateDexcomTokens = async (
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
): Promise<void> => {
  const now = Date.now();
  const expiresAt = now + expiresIn * 1000;
  const refreshTokenCreated = now;

  await setDexcomTokens({
    accessToken,
    refreshToken,
    expiresAt,
    refreshTokenCreated,
  });
};

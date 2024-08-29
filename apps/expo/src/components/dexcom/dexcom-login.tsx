import React, { useCallback, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useWarmUpBrowser } from "~/hooks/use-warm-up-browser";
import { api } from "~/utils/api";
import {
  deleteDexcomTokens,
  getDexcomTokens,
  updateDexcomTokens,
} from "~/utils/dexcom-store";

WebBrowser.maybeCompleteAuthSession();

const DEXCOM_SANDBOX_BASE_URL = "https://sandbox-api.dexcom.com";
const CLIENT_ID = process.env.EXPO_PUBLIC_DEXCOM_CLIENT_ID;
const REDIRECT_URI = Linking.createURL("/(app)/(tabs)/account");
const RESPONSE_TYPE = "code";
const SCOPE = "offline_access";

const DexcomLogin: React.FC = () => {
  useWarmUpBrowser();
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
  }>({
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  });

  const dexcomAuthMutation = api.dexcom.authorize.useMutation();

  useEffect(() => {
    const fetchTokens = async () => {
      // Delete any existing tokens
      // await deleteDexcomTokens();

      const storedTokens = await getDexcomTokens();
      if (storedTokens) {
        setTokens(storedTokens);
      }
    };

    void fetchTokens();
  }, []);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const state = Math.random().toString(36).substring(7);
      const authUrl = `${DEXCOM_SANDBOX_BASE_URL}/v2/oauth2/login?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI,
      )}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&state=${state}`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        REDIRECT_URI,
      );

      if (result.type === "success") {
        const {
          code,
          error,
          state: returnedState,
        } = Linking.parse(result.url).queryParams as {
          code?: string;
          error?: string;
          state?: string;
        };

        if (error) {
          Alert.alert(
            "Authentication Error",
            error === "access_denied"
              ? "You've denied access to your Dexcom account."
              : `An error occurred: ${error}`,
          );
          return;
        }

        if (!code) {
          Alert.alert(
            "Authentication Error",
            "No authorization code received.",
          );
          return;
        }

        if (returnedState !== state) {
          Alert.alert(
            "Security Error",
            "State mismatch. Possible security breach detected.",
          );
          return;
        }

        // Exchange the code for tokens using tRPC mutation
        const tokenData = await dexcomAuthMutation.mutateAsync({ code });

        // Store the tokens securely using the updated dexcom-store utility
        await updateDexcomTokens(
          tokenData.accessToken,
          tokenData.refreshToken,
          tokenData.expiresIn,
        );

        Alert.alert("Success", "Successfully connected to Dexcom!");
        // TODO: Handle successful authentication (e.g., navigate to a new screen)
      } else if (result.type === WebBrowser.WebBrowserResultType.CANCEL) {
        Alert.alert(
          "Cancelled",
          "You've cancelled the Dexcom connection process.",
        );
      }
    } catch (error) {
      console.error("Dexcom authentication error", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred during Dexcom authentication.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [dexcomAuthMutation]);

  return (
    <View>
      <Text>Dexcom Login</Text>
      <Button onPress={handleLogin} disabled={isLoading}>
        <Text>{isLoading ? "Connecting..." : "Connect with Dexcom"}</Text>
      </Button>
      <Text>Access Token: {tokens.accessToken ?? "Not available"}</Text>
      <Text>Refresh Token: {tokens.refreshToken ?? "Not available"}</Text>
      <Text>
        Expires At:{" "}
        {tokens.expiresAt
          ? new Date(tokens.expiresAt).toLocaleString()
          : "Not available"}
      </Text>
    </View>
  );
};

export { DexcomLogin };

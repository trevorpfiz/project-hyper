import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/utils/api";
import { getDexcomTokens, updateDexcomTokens } from "~/utils/dexcom-store";

const DexcomCGMData: React.FC = () => {
  const [isFetching, setIsFetching] = useState(false);

  const fetchAndStoreEGVsMutation = api.dexcom.fetchAndStoreEGVs.useMutation();

  const today = new Date();
  const startDate = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endDate = new Date().toISOString();

  const queryInput = { startDate, endDate };

  const {
    data: cgmData,
    isLoading: isLoadingStoredData,
    refetch: refetchStoredData,
  } = api.dexcom.getStoredEGVs.useQuery(queryInput);

  const handleFetchData = async () => {
    setIsFetching(true);
    try {
      const tokens = getDexcomTokens();
      if (!tokens) {
        Alert.alert(
          "Error",
          "No Dexcom tokens found. Please connect to Dexcom first.",
        );
        return;
      }

      const result = await fetchAndStoreEGVsMutation.mutateAsync({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: tokens.expiresAt,
        startDate,
        endDate,
      });

      if (result.newTokens) {
        updateDexcomTokens(
          result.newTokens.accessToken,
          result.newTokens.refreshToken,
          result.newTokens.expiresAt,
        );
      }

      await refetchStoredData();
      Alert.alert("Success", "CGM data fetched and stored successfully.");
    } catch (error) {
      console.error("Error fetching and storing CGM data:", error);
      Alert.alert(
        "Error",
        "Failed to fetch and store CGM data. Please try again.",
      );
    } finally {
      setIsFetching(false);
    }
  };

  if (isLoadingStoredData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading CGM data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Today's CGM Data
      </Text>
      <Button onPress={handleFetchData} disabled={isFetching}>
        <Text>{isFetching ? "Fetching..." : "Fetch New CGM Data"}</Text>
      </Button>
      {!cgmData || cgmData.length === 0 ? (
        <Text>No CGM data available for today.</Text>
      ) : (
        cgmData.map((dataPoint) => (
          <View key={dataPoint.id} style={{ marginBottom: 12 }}>
            <Text>
              Time: {new Date(dataPoint.displayTime).toLocaleTimeString()}
            </Text>
            <Text>Glucose Value: {dataPoint.glucoseValue} mg/dL</Text>
            <Text>Trend: {dataPoint.trend}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default DexcomCGMData;

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

import { Text } from "~/components/ui/text";
import { api } from "~/utils/api";
import { getDexcomTokens, updateDexcomTokens } from "~/utils/dexcom-store";

interface CGMDataPoint {
  recordId: string;
  systemTime: string;
  displayTime: string;
  glucoseValue: number;
  trend: string;
}

const DexcomCGMData: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cgmData, setCgmData] = useState<CGMDataPoint[]>([]);

  const fetchCGMDataQuery = api.dexcom.fetchCGMData.useQuery;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokens = await getDexcomTokens();
        if (!tokens) {
          Alert.alert(
            "Error",
            "No Dexcom tokens found. Please connect to Dexcom first.",
          );
          setIsLoading(false);
          return;
        }

        const today = new Date();
        const startDate = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endDate = new Date().toISOString();

        const result = await fetchCGMDataQuery({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenExpiresAt: tokens.expiresAt,
          startDate,
          endDate,
        });

        if (result.newTokens) {
          // Update tokens in storage if they were refreshed
          await updateDexcomTokens(
            result.newTokens.accessToken,
            result.newTokens.refreshToken,
            result.newTokens.expiresAt,
          );
        }

        setCgmData(result.cgmData.egvs);
      } catch (error) {
        console.error("Error fetching CGM data:", error);
        Alert.alert("Error", "Failed to fetch CGM data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchCGMDataQuery]);

  if (isLoading) {
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
      {cgmData.length === 0 ? (
        <Text>No CGM data available for today.</Text>
      ) : (
        cgmData.map((dataPoint) => (
          <View key={dataPoint.recordId} style={{ marginBottom: 12 }}>
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

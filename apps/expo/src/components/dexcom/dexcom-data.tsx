import { useEffect } from "react";
import { Alert, View } from "react-native";
import { DateTime } from "luxon";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useGlucoseStore } from "~/stores/glucose-store";
import { api } from "~/utils/api";

const DexcomCGMData: React.FC = () => {
  const utils = api.useUtils();
  const { lastSyncedTime, setLastSyncedTime } = useGlucoseStore();

  const fetchDataRangeQuery = api.dexcom.fetchDataRange.useQuery({
    lastSyncTime: lastSyncedTime ?? undefined,
  });

  const fetchAndStoreEGVsMutation = api.dexcom.fetchAndStoreEGVs.useMutation({
    async onSuccess(data) {
      if (data.recordsInserted > 0) {
        Alert.alert(
          "Success",
          `${data.recordsInserted} CGM records fetched and stored successfully. Last sync time: ${data.latestEGVTimestamp}`,
        );
        await utils.dexcom.getStoredEGVs.invalidate();
        await utils.dexcom.getLatestEGV.invalidate();
        if (data.latestEGVTimestamp) {
          setLastSyncedTime(
            DateTime.fromISO(data.latestEGVTimestamp, { zone: "utc" }),
          );
        }
      } else {
        Alert.alert("Info", "No new CGM data available.");
      }
    },
  });

  useEffect(() => {
    if (fetchDataRangeQuery.data) {
      console.log("Data range fetched:", fetchDataRangeQuery.data);
    }
  }, [fetchDataRangeQuery.data]);

  const handleFetchData = () => {
    if (fetchDataRangeQuery.data?.egvs) {
      const augustStart = DateTime.utc(2024, 8, 1).startOf("month");

      const dataRangeStart = DateTime.fromISO(
        fetchDataRangeQuery.data.egvs.start.systemTime,
        { zone: "utc" },
      );
      const dataRangeEnd = DateTime.fromISO(
        fetchDataRangeQuery.data.egvs.end.systemTime,
        { zone: "utc" },
      );

      const startDate =
        dataRangeStart > augustStart ? dataRangeStart : augustStart;

      const queryInput = {
        startDate: startDate.toUTC().toISO() ?? "",
        endDate: dataRangeEnd.toUTC().toISO() ?? "",
      };

      fetchAndStoreEGVsMutation.mutate(queryInput);
    } else {
      Alert.alert("Error", "Unable to fetch data range. Please try again.");
    }
  };

  if (fetchDataRangeQuery.isPending) {
    return <Text>Loading...</Text>;
  }

  if (fetchDataRangeQuery.isError) {
    return <Text>Error: {fetchDataRangeQuery.error.message}</Text>;
  }

  return (
    <View>
      <Button
        onPress={handleFetchData}
        disabled={fetchAndStoreEGVsMutation.isPending}
      >
        <Text>
          {fetchAndStoreEGVsMutation.isPending
            ? "Fetching..."
            : "Fetch August 2024 CGM Data"}
        </Text>
      </Button>
      {fetchAndStoreEGVsMutation.isError ? (
        <Text>
          An error occurred: {fetchAndStoreEGVsMutation.error.message}
        </Text>
      ) : null}
      <Text>
        Last Synced:{" "}
        {lastSyncedTime
          ? DateTime.fromISO(lastSyncedTime, { zone: "utc" })
              .toLocal()
              .toString()
          : "Never"}
      </Text>
    </View>
  );
};

export default DexcomCGMData;

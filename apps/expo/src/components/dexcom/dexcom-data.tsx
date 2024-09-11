import { useEffect } from "react";
import { Alert, View } from "react-native";
import {
  endOfMonth,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
} from "date-fns";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useGlucoseStore } from "~/stores/glucose-store";
import { api } from "~/utils/api";

const DexcomCGMData: React.FC = () => {
  const utils = api.useUtils();
  const { lastSyncedTime, setLastSyncedTime } = useGlucoseStore();

  const fetchDataRangeQuery = api.dexcom.fetchDataRange.useQuery({});

  const fetchAndStoreEGVsMutation = api.dexcom.fetchAndStoreEGVs.useMutation({
    async onSuccess(data) {
      if (data.recordsInserted > 0) {
        Alert.alert(
          "Success",
          `${data.recordsInserted} CGM records fetched and stored successfully.`,
        );
        await utils.dexcom.getStoredEGVs.invalidate();
        if (data.latestEGVTimestamp) {
          setLastSyncedTime(new Date(data.latestEGVTimestamp));
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
      const augustStart = startOfMonth(new Date(2024, 7));
      const augustEnd = endOfMonth(new Date(2024, 7));

      const dataRangeStart = parseISO(
        fetchDataRangeQuery.data.egvs.start.systemTime,
      );
      const dataRangeEnd = parseISO(
        fetchDataRangeQuery.data.egvs.end.systemTime,
      );

      const startDate = isAfter(dataRangeStart, augustStart)
        ? fetchDataRangeQuery.data.egvs.start.systemTime
        : augustStart.toISOString();

      const endDate = isBefore(dataRangeEnd, augustEnd)
        ? fetchDataRangeQuery.data.egvs.end.systemTime
        : augustEnd.toISOString();

      const queryInput = {
        startDate,
        endDate,
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
        {lastSyncedTime ? lastSyncedTime.toLocaleString() : "Never"}
      </Text>
    </View>
  );
};

export default DexcomCGMData;

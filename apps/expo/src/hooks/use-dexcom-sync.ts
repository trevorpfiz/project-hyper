import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { DateTime } from "luxon";

import { useGlucoseStore } from "~/stores/glucose-store";
import { api } from "~/utils/api";

export function useDexcomSync() {
  const utils = api.useUtils();
  const { lastSyncedTime, setLastSyncedTime } = useGlucoseStore();
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchDataRangeQuery = api.dexcom.fetchDataRange.useQuery(
    { lastSyncTime: lastSyncedTime ?? undefined },
    { enabled: false },
  );

  const isLoading =
    fetchDataRangeQuery.isPending && fetchDataRangeQuery.isFetching;

  const fetchAndStoreEGVsMutation = api.dexcom.fetchAndStoreEGVs.useMutation({
    onSuccess: async (data) => {
      if (data.recordsInserted > 0) {
        await utils.dexcom.getStoredEGVs.invalidate();
        await utils.dexcom.getLatestEGV.invalidate();
        if (data.latestEGVTimestamp) {
          setLastSyncedTime(
            DateTime.fromISO(data.latestEGVTimestamp, { zone: "utc" }),
          );
        }
      }
    },
    onError: (error) => {
      Alert.alert("Error", `Failed to sync: ${error.message}`);
    },
  });

  const calculateRecapsMutation =
    api.recap.calculateAndStoreRecapsForRange.useMutation({
      onSuccess: async () => {
        await utils.recap.invalidate();
      },
      onError: (error) => {
        Alert.alert("Error", `Failed to calculate recaps: ${error.message}`);
      },
    });

  const performSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const fetchDataRangeResult = await fetchDataRangeQuery.refetch();
      if (!fetchDataRangeResult.data?.egvs) {
        Alert.alert("Error", "Unable to fetch data range. Please try again.");
        return;
      }

      const augustStart = DateTime.utc(2024, 8, 1).startOf("month");
      const dataRangeStart = DateTime.fromISO(
        fetchDataRangeResult.data.egvs.start.systemTime,
        { zone: "utc" },
      );
      const dataRangeEnd = DateTime.fromISO(
        fetchDataRangeResult.data.egvs.end.systemTime,
        { zone: "utc" },
      );
      const startDate =
        dataRangeStart > augustStart ? dataRangeStart : augustStart;

      const queryInput = {
        startDate: startDate.toUTC().toISO() ?? "",
        endDate: dataRangeEnd.toUTC().toISO() ?? "",
      };

      const result = await fetchAndStoreEGVsMutation.mutateAsync(queryInput);

      if (result.recordsInserted > 0 && result.latestEGVTimestamp) {
        const userTimezone = DateTime.local().zoneName;
        const recapStartDate = startDate
          .setZone(userTimezone)
          .startOf("day")
          .toISO();

        await calculateRecapsMutation.mutateAsync({
          startDate: recapStartDate ?? "",
          timezone: userTimezone,
        });
      }
    } finally {
      setIsSyncing(false);
    }
  }, [fetchDataRangeQuery, fetchAndStoreEGVsMutation, calculateRecapsMutation]);

  const syncNow = useCallback(() => {
    void performSync();
  }, [performSync]);

  return {
    syncNow,
    isPending:
      isSyncing ||
      isLoading ||
      fetchAndStoreEGVsMutation.isPending ||
      calculateRecapsMutation.isPending,
  };
}

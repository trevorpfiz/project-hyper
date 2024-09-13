import { useCallback, useEffect, useState } from "react";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { DateTime } from "luxon";

import { BACKGROUND_FETCH_DEXCOM_SYNC } from "~/lib/constants";
import { useGlucoseStore } from "~/stores/glucose-store";
import { api } from "~/utils/api";

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundFetchAsync() {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_DEXCOM_SYNC, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false, // android only
      startOnBoot: true, // android only
    });
    await BackgroundFetch.setMinimumIntervalAsync(15 * 60); // 15 minutes, iOS minimum
    console.log("Background fetch registered");
  } catch (err) {
    console.log("Background fetch failed to register", err);
  }
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_DEXCOM_SYNC);
}

export function useDexcomSync() {
  const { lastSyncedTime, setLastSyncedTime } = useGlucoseStore();
  const [status, setStatus] =
    useState<BackgroundFetch.BackgroundFetchStatus | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const fetchDataRangeQuery = api.dexcom.fetchDataRange.useQuery({
    lastSyncTime: lastSyncedTime ?? undefined,
  });
  const fetchAndStoreEGVsMutation = api.dexcom.fetchAndStoreEGVs.useMutation();

  useEffect(() => {
    void checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const fetchStatus = await BackgroundFetch.getStatusAsync();
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_DEXCOM_SYNC,
    );
    setStatus(fetchStatus);
    setIsRegistered(isTaskRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }
    await checkStatusAsync();
  };

  const syncNow = useCallback(async () => {
    try {
      if (fetchDataRangeQuery.data?.egvs) {
        const startDate = DateTime.fromISO(
          fetchDataRangeQuery.data.egvs.start.systemTime,
          { zone: "utc" },
        );
        const endDate = DateTime.fromISO(
          fetchDataRangeQuery.data.egvs.end.systemTime,
          { zone: "utc" },
        );

        const result = await fetchAndStoreEGVsMutation.mutateAsync({
          startDate: startDate.toISO() ?? "",
          endDate: endDate.toISO() ?? "",
        });

        if (result.recordsInserted > 0 && result.latestEGVTimestamp) {
          setLastSyncedTime(
            DateTime.fromISO(result.latestEGVTimestamp, { zone: "utc" }),
          );
          console.log("New data synced");
        } else {
          console.log("No new data available");
        }
      }
    } catch (error) {
      console.error("Sync failed", error);
    }
  }, [
    fetchDataRangeQuery.data?.egvs,
    fetchAndStoreEGVsMutation,
    setLastSyncedTime,
  ]);

  return {
    syncNow,
    status,
    isRegistered,
    toggleFetchTask,
    isPending:
      fetchDataRangeQuery.isPending || fetchAndStoreEGVsMutation.isPending,
  };
}

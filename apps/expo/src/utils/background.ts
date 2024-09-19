import * as BackgroundFetch from "expo-background-fetch";
import { DateTime } from "luxon";

import { useGlucoseStore } from "~/stores/glucose-store";
import { dexcomTrpcClient } from "~/utils/dexcom-trpc-client";

export const BACKGROUND_FETCH_DEXCOM_SYNC = "background-fetch-dexcom-sync";

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundFetchAsync(taskName: string) {
  try {
    await BackgroundFetch.registerTaskAsync(taskName, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false, // android only
      startOnBoot: true, // android only
    });
    await BackgroundFetch.setMinimumIntervalAsync(15 * 60); // 15 minutes, iOS minimum
    console.log(`Background fetch registered for task: ${taskName}`);
  } catch (err) {
    console.log(
      `Background fetch failed to register for task: ${taskName}`,
      err,
    );
  }
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function unregisterBackgroundFetchAsync(taskName: string) {
  try {
    await BackgroundFetch.unregisterTaskAsync(taskName);
    console.log(`Background fetch unregistered for task: ${taskName}`);
  } catch (err) {
    console.log(
      `Failed to unregister background fetch for task: ${taskName}`,
      err,
    );
  }
}

// Dexcom background fetch
export async function syncDexcomData() {
  const glucoseStore = useGlucoseStore.getState();
  const { lastSyncedTime, setLastSyncedTime, userTimezone } = glucoseStore;

  try {
    const fetchDataRangeResult =
      await dexcomTrpcClient.dexcom.fetchDataRange.query({
        lastSyncTime: lastSyncedTime ?? undefined,
      });

    if (fetchDataRangeResult.egvs) {
      const startDate = DateTime.fromISO(
        fetchDataRangeResult.egvs.start.systemTime,
        { zone: "utc" },
      );
      const endDate = DateTime.fromISO(
        fetchDataRangeResult.egvs.end.systemTime,
        { zone: "utc" },
      );

      const result = await dexcomTrpcClient.dexcom.fetchAndStoreEGVs.mutate({
        startDate: startDate.toISO() ?? "",
        endDate: endDate.toISO() ?? "",
      });

      if (result.recordsInserted > 0 && result.latestEGVTimestamp) {
        const newLastSyncedTime = DateTime.fromISO(result.latestEGVTimestamp, {
          zone: "utc",
        });
        setLastSyncedTime(newLastSyncedTime);

        console.log("New data synced");

        // Calculate recap for latest day
        const recapStartDate = newLastSyncedTime
          .setZone(userTimezone)
          .startOf("day")
          .toISO();

        await dexcomTrpcClient.recap.calculateAndStoreRecapsForRange.mutate({
          startDate: recapStartDate ?? "",
          timezone: userTimezone,
        });

        // TODO: notifications
        return BackgroundFetch.BackgroundFetchResult.NewData;
      } else {
        console.log("No new data available");
        return BackgroundFetch.BackgroundFetchResult.NoData;
      }
    } else {
      console.log("No data range available");
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {
    console.error("Background sync failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
}

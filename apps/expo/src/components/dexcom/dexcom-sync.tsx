import { View } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useDexcomSync } from "~/hooks/use-dexcom-sync";
import { BACKGROUND_FETCH_DEXCOM_SYNC } from "~/lib/constants";
import { useGlucoseStore } from "~/stores/glucose-store";

const BACKGROUND_FETCH_TASK = "background-fetch";

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const { lastSyncedTime } = useGlucoseStore();

  try {
    const result = await performSync(lastSyncedTime);

    if (result.newData) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New CGM Data Available",
          body: "Tap to view your latest glucose readings.",
        },
        trigger: null,
      });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {
    console.error("Background sync failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export function DexcomBackgroundSync() {
  const { status, syncNow, isPending, isRegistered, toggleFetchTask } =
    useDexcomSync();

  return (
    <View className="flex-1 items-center justify-center">
      <View className="mb-5">
        <Text className="text-base">
          Background fetch status:{" "}
          <Text className="font-bold">
            {status !== null
              ? BackgroundFetch.BackgroundFetchStatus[status]
              : "Unknown"}
          </Text>
        </Text>
        <Text className="mt-2 text-base">
          Background fetch task name:{" "}
          <Text className="font-bold">
            {isRegistered
              ? BACKGROUND_FETCH_DEXCOM_SYNC
              : "Not registered yet!"}
          </Text>
        </Text>
      </View>
      <View className="w-4/5">
        <Button onPress={toggleFetchTask}>
          <Text>
            {isRegistered
              ? "Unregister BackgroundFetch task"
              : "Register BackgroundFetch task"}
          </Text>
        </Button>
        <View className="h-4" />
        <Button onPress={syncNow} disabled={isPending}>
          <Text>{isPending ? "Syncing..." : "Sync Now"}</Text>
        </Button>
      </View>
    </View>
  );
}

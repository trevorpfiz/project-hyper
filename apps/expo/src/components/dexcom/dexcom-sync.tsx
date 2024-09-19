import { View } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useDexcomSync } from "~/hooks/use-dexcom-sync";
import { BACKGROUND_FETCH_DEXCOM_SYNC } from "~/utils/background";

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

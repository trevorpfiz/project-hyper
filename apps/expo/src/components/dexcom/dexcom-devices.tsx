import { ActivityIndicator, ScrollView, View } from "react-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/utils/api";

const DexcomDevicesList = () => {
  const {
    data: devicesData,
    isLoading,
    isError,
    error,
    refetch,
  } = api.dexcom.fetchDevices.useQuery();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text>Loading Dexcom devices...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Error: {error.message}</Text>
        <Button onPress={() => refetch()} className="mt-4">
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView className="p-4">
      <Text className="mb-4 text-2xl font-bold">Dexcom Devices</Text>
      <Button onPress={() => refetch()} className="mb-4">
        <Text>Refresh Devices</Text>
      </Button>
      {devicesData?.devices.map((device, index) => (
        <View key={index} className="mb-6 rounded-lg p-4">
          <Text className="font-semibold">Device {index + 1}</Text>
          <Text>Display Device: {device.displayDevice}</Text>
          <Text>Transmitter Generation: {device.transmitterGeneration}</Text>
          <Text>
            Last Upload: {new Date(device.lastUploadDate).toLocaleString()}
          </Text>
          {device.transmitterId && (
            <Text>Transmitter ID: {device.transmitterId}</Text>
          )}
          {device.displayApp && <Text>Display App: {device.displayApp}</Text>}
        </View>
      ))}
    </ScrollView>
  );
};

export default DexcomDevicesList;

import React from "react";
import { Alert, View } from "react-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/utils/api";

const CalculateRecap: React.FC = () => {
  const utils = api.useUtils();

  const mutation = api.recap.calculateAndStoreRecapsForRange.useMutation({
    onSuccess: async (data) => {
      Alert.alert(
        "Success",
        `Recaps calculated and stored successfully for ${data.length} days.`,
      );
      await utils.recap.getDailyRecaps.invalidate();
    },
    onError: (error) => {
      Alert.alert("Error", `Failed to calculate recaps: ${error.message}`);
    },
  });

  const handleCalculateRecaps = () => {
    const augustStart = new Date("2024-08-01T00:00:00Z");
    const augustEnd = new Date("2024-08-31T23:59:59Z");

    const queryInput = {
      startDate: augustStart.toISOString(),
      endDate: augustEnd.toISOString(),
    };

    mutation.mutate(queryInput);
  };

  return (
    <View>
      <Button onPress={handleCalculateRecaps} disabled={mutation.isPending}>
        <Text>
          {mutation.isPending
            ? "Calculating..."
            : "Calculate August 2024 Recaps"}
        </Text>
      </Button>
      {mutation.isError ? (
        <Text>An error occurred: {mutation.error.message}</Text>
      ) : null}
      {mutation.isSuccess ? (
        <Text>Last calculated: {new Date().toLocaleString()}</Text>
      ) : null}
    </View>
  );
};

export { CalculateRecap };

import React from "react";
import { Alert, View } from "react-native";
import { DateTime } from "luxon";

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
    // const calendars = Localization.getCalendars();
    // const userTimeZone = calendars[0]!.timeZone ?? "UTC";
    // const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userTimezone = DateTime.local().zoneName;

    // Get the start and end of August 2024 in the user's local time
    const augustStart = DateTime.local(2024, 8, 1, {
      zone: userTimezone,
    }).startOf("month");
    const augustEnd = augustStart.endOf("month");

    console.log("augustStart", augustStart);
    console.log("augustEnd", augustEnd);

    const queryInput = {
      startDate: augustStart.toISO() ?? "",
      endDate: augustEnd.toISO() ?? "",
      timezone: userTimezone,
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

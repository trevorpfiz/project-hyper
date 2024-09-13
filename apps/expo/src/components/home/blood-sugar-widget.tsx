import type { z } from "zod";
import { View } from "react-native";
import { DateTime } from "luxon";

import type { TrendEnum } from "@hyper/validators/dexcom";

import type { MacrosData } from "~/data/macros";
import { TrendIcon } from "~/components/home/trend-icon";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { mockMacrosData } from "~/data/macros";
import { useColorScheme } from "~/lib/use-color-scheme";
import { cn, getBloodSugarColors } from "~/lib/utils";
import { useGlucoseStore } from "~/stores/glucose-store";
import { api } from "~/utils/api";

const MacroItem = ({ label, value }: MacrosData) => (
  <View className="flex-row">
    <Text className="text-sm font-semibold">{value}</Text>
    <Text className="text-sm text-gray-500">{label}</Text>
  </View>
);

export default function BloodSugarWidget() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { rangeView } = useGlucoseStore();

  const { data: latestEgv, isPending } = api.dexcom.getLatestEGV.useQuery();

  const bloodSugar = latestEgv?.egv?.glucoseValue ?? 0;
  const localTime = latestEgv?.egv?.systemTime
    ? DateTime.fromJSDate(latestEgv.egv.systemTime).toLocal()
    : DateTime.now();

  const bloodSugarColors = getBloodSugarColors(bloodSugar, isDark, rangeView);

  console.log("Raw system time:", latestEgv?.egv?.systemTime);
  console.log("Parsed system time:", localTime.toISO());

  return (
    <View className="flex-col items-center gap-4 pb-4">
      {/* Blood Sugar */}
      {isPending ? (
        <Skeleton className="h-32 w-32 rounded-full" />
      ) : (
        <View
          className={cn("h-32 w-32 items-center justify-center rounded-full")}
          style={{ backgroundColor: bloodSugarColors.background }}
        >
          <Text
            className="mb-1 text-sm"
            style={{ color: bloodSugarColors.text }}
          >
            {localTime.toLocaleString(DateTime.TIME_SIMPLE)}
          </Text>
          <View className="flex-row items-center justify-between gap-1">
            <Text
              className="text-3xl font-bold"
              style={{ color: bloodSugarColors.text }}
            >
              {bloodSugar}
            </Text>
            <TrendIcon
              trend={
                (latestEgv?.egv?.trend ?? "unknown") as z.infer<
                  typeof TrendEnum
                >
              }
              color={bloodSugarColors.text}
            />
          </View>
          <Text
            className="mt-1 text-sm"
            style={{ color: bloodSugarColors.text }}
          >
            mg/dL
          </Text>
        </View>
      )}

      {/* Macros */}
      <View className="flex-row items-center justify-center gap-4">
        <Text className="text-sm font-medium">Daily Macros:</Text>
        <View className="flex-row gap-2">
          {mockMacrosData.map((macro, index) => (
            <MacroItem key={index} {...macro} />
          ))}
        </View>
      </View>
    </View>
  );
}

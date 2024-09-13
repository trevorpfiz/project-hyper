import type { z } from "zod";
import { View } from "react-native";
import { DateTime } from "luxon";

import type { TrendEnum } from "@hyper/validators/dexcom";

import { TrendIcon } from "~/components/home/trend-icon";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/use-color-scheme";
import { cn, getBloodSugarColors } from "~/lib/utils";
import { useGlucoseStore } from "~/stores/glucose-store";
import { api } from "~/utils/api";

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
    <View className="flex-col items-center justify-between pb-4">
      {/* Blood Sugar */}
      {isPending ? (
        <Skeleton className="h-40 w-40 rounded-full" />
      ) : (
        <View
          className={cn(
            "h-40 w-40 flex-col items-center justify-center gap-3 rounded-full",
          )}
          style={{ backgroundColor: bloodSugarColors.background }}
        >
          <Text className="text-md" style={{ color: bloodSugarColors.text }}>
            {localTime.toLocaleString(DateTime.TIME_SIMPLE)}
          </Text>
          <View className="flex-row items-center justify-between gap-1">
            <Text
              className="text-4xl font-bold"
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
          <Text className="text-md" style={{ color: bloodSugarColors.text }}>
            mg/dL
          </Text>
        </View>
      )}
    </View>
  );
}

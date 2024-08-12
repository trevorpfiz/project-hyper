import { View } from "react-native";

import type { MacrosData } from "~/data/macros";
import { Text } from "~/components/ui/text";
import { mockMacrosData } from "~/data/macros";
import { useColorScheme } from "~/lib/use-color-scheme";
import { cn, getBloodSugarColors } from "~/lib/utils";

const MacroItem = ({ label, value }: MacrosData) => (
  <View className="flex-row">
    <Text className="text-sm font-semibold">{value}</Text>
    <Text className="text-sm text-gray-500">{label}</Text>
  </View>
);

export default function BloodSugarWidget() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const bloodSugar = 194;
  const bloodSugarColors = getBloodSugarColors(bloodSugar, isDark);

  return (
    <View className="flex-col items-center gap-4 pb-4">
      {/* Blood Sugar */}
      <View
        className={cn("h-32 w-32 items-center justify-center rounded-full")}
        style={{ backgroundColor: bloodSugarColors.background }}
      >
        <Text className="mb-1 text-xs" style={{ color: bloodSugarColors.text }}>
          9:40 AM
        </Text>
        <View className="flex-row items-baseline">
          <Text
            className="text-3xl font-bold"
            style={{ color: bloodSugarColors.text }}
          >
            {bloodSugar}
          </Text>
          <Text
            className="ml-1 text-sm"
            style={{ color: bloodSugarColors.text }}
          >
            ↑
          </Text>
        </View>
        <Text className="mt-1 text-xs" style={{ color: bloodSugarColors.text }}>
          mg/dL
        </Text>
      </View>

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

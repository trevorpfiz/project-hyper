import React from "react";
import { View } from "react-native";

import type { MacroItem, MacrosData } from "~/data/macros";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

const MacrosCard = (props: { macrosData: MacrosData }) => {
  const { macrosData } = props;

  return (
    <Card className="h-full w-full bg-gray-900">
      <CardHeader className="py-4">
        <CardTitle className="text-lg font-bold">
          Daily Macronutrients
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-6">
        <View className="w-full flex-col items-center justify-between gap-3">
          <View className="w-full flex-row items-center justify-between">
            <MacroItem {...macrosData.calories} hideUnit />
            <Separator orientation="vertical" className="h-2/3 bg-gray-400" />
            <MacroItem {...macrosData.protein} />
            <Separator orientation="vertical" className="h-2/3 bg-gray-400" />
            <MacroItem {...macrosData.fat} />
            <Separator orientation="vertical" className="h-2/3 bg-gray-400" />
            <MacroItem {...macrosData.carbs} />
          </View>
          <View className="w-full flex-row items-center justify-between">
            <MacroItem
              {...macrosData.calories}
              hideLabel
              className="opacity-0"
            />
            <Separator
              orientation="vertical"
              className="h-2/3 bg-gray-400 opacity-0"
            />
            <MacroItem {...macrosData.fiber} />
            <Separator orientation="vertical" className="h-2/3 bg-gray-400" />
            <MacroItem {...macrosData.sugar} />
            <Separator orientation="vertical" className="h-2/3 bg-gray-400" />
            <MacroItem {...macrosData.addedSugar} />
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

const MacroItem = ({
  label,
  value,
  unit,
  hideUnit = false,
  hideLabel = false,
  className,
}: MacroItem & {
  hideUnit?: boolean;
  hideLabel?: boolean;
  className?: string;
}) => (
  <View className={cn("flex-1 flex-col items-center gap-0", className)}>
    <View className="flex-row items-center gap-1">
      <Text className="text-lg font-semibold">{value}</Text>
      {!hideUnit && <Text className="text-xs text-gray-400">{unit}</Text>}
    </View>
    {!hideLabel && <Text className="text-xs text-gray-400">{label}</Text>}
  </View>
);

export { MacrosCard };

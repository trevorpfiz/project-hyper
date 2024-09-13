import React from "react";
import { View } from "react-native";

import { MacrosCard } from "~/components/home/macros-card";
import { mockMacrosData } from "~/data/macros";

const MacrosWidget = () => {
  return (
    <View className="px-4 pb-8 pt-4">
      <MacrosCard macrosData={mockMacrosData} />
    </View>
  );
};

export { MacrosWidget };

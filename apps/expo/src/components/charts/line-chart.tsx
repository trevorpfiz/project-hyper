import type { SharedValue } from "react-native-reanimated";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { useDerivedValue } from "react-native-reanimated";
import { Inter_500Medium } from "@expo-google-fonts/inter";
import { Circle, Text as SKText, useFont } from "@shopify/react-native-skia";
import { CartesianChart, Line, useChartPressState } from "victory-native";

import { DATA, generateData } from "~/components/charts/data";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/use-color-scheme";

export default function MyChart() {
  const { colorScheme } = useColorScheme();
  const font = useFont(Inter_500Medium, 12);
  const inspectFont = useFont(Inter_500Medium, 30);
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });

  const [chartData, setChartData] = useState(DATA);

  const value = useDerivedValue(() => {
    return "$" + state.y.highTmp.value.value.toFixed(2);
  }, [state]);

  const labelColor = colorScheme === "dark" ? "white" : "black";
  const lineColor = colorScheme === "dark" ? "lightgray" : "black";

  const refreshData = useCallback(() => {
    setChartData(generateData());
  }, []);

  return (
    <View className="h-80 w-full">
      <CartesianChart
        data={chartData}
        xKey="day"
        yKeys={["highTmp"]}
        domainPadding={{ top: 30 }}
        axisOptions={{ font, labelColor, lineColor }}
        chartPressState={state}
      >
        {({ points, chartBounds }) => (
          <>
            <SKText
              x={chartBounds.left + 10}
              y={40}
              font={inspectFont}
              text={value}
              color={labelColor}
              style={"fill"}
            />
            <Line
              points={points.highTmp}
              color="lightgreen"
              strokeWidth={3}
              animate={{ type: "timing", duration: 500 }}
              connectMissingData={false}
            />
            {isActive ? (
              <ToolTip x={state.x.position} y={state.y.highTmp.position} />
            ) : null}
          </>
        )}
      </CartesianChart>
      <Button onPress={refreshData}>
        <Text>Update Data</Text>
      </Button>
    </View>
  );
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="gray" opacity={0.8} />;
}

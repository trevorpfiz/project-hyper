import type { StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import colors, { black, white } from "tailwindcss/colors";

import { useColorScheme } from "~/lib/use-color-scheme";
import ExpandingDot from "./expanding-dot";
import ScalingDot from "./scaling-dot";

export interface PagingDotsProps {
  count: number;
  scrollX: SharedValue<number>;
  dotStyle?: ViewStyle;
  inactiveDotOpacity?: number;
  inactiveDotColor?: string;
  activeDotScale?: number;
  activeDotColor?: string;
  expandingDotWidth?: number;
  style?: StyleProp<ViewStyle>;
  dotType?: "expanding" | "scaling" | null | undefined;
}

const PagingDots: React.FC<PagingDotsProps> = ({
  count,
  style,
  dotType = "expanding",
  ...rest
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const DotComponent = dotType === "expanding" ? ExpandingDot : ScalingDot;

  const inactiveDotColor = isDark ? colors.gray[500] : colors.gray[300];
  const activeDotColor = isDark ? white : black;

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <DotComponent
          key={`dot-${index}`}
          index={index}
          inactiveDotColor={inactiveDotColor}
          activeDotColor={activeDotColor}
          {...rest}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignSelf: "center",
  },
});

export default PagingDots;

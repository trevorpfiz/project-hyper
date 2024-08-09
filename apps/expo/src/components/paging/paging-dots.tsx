import type { StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import { StyleSheet, View } from "react-native";

import ExpandingDot from "./expanding-dot";
import ScalingDot from "./scaling-dot";

export interface PagingDotsProps {
  data: object[];
  scrollX: SharedValue<number>;
  dotStyle?: ViewStyle;
  inactiveDotOpacity?: number;
  inactiveDotColor?: string;
  activeDotScale?: number;
  activeDotColor?: string;
  expandingDotWidth?: number;
  style?: StyleProp<ViewStyle>;
  dotType?: "scaling" | "expanding" | null | undefined;
}

const PagingDots: React.FC<PagingDotsProps> = ({
  data,
  style,
  dotType = "scaling",
  ...rest
}) => {
  const DotComponent = dotType === "expanding" ? ExpandingDot : ScalingDot;

  return (
    <View style={[styles.container, style]}>
      {data.map((_, index) => {
        return <DotComponent key={`dot-${index}`} index={index} {...rest} />;
      })}
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

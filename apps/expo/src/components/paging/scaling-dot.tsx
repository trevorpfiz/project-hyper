import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import type { PagingDotsProps } from "./paging-dots";

type Props = Omit<PagingDotsProps, "count" | "style" | "dotType"> & {
  index: number;
};

const ScalingDot: React.FC<Props> = ({
  scrollX,
  index,
  dotStyle,
  inactiveDotOpacity,
  inactiveDotColor,
  activeDotScale,
  activeDotColor,
}) => {
  const dp = {
    inactiveDotColor: inactiveDotColor ?? "#347af0",
    activeDotColor: activeDotColor ?? "#347af0",
    animationType: "scale",
    inactiveDotOpacity: inactiveDotOpacity ?? 0.5,
    activeDotScale: activeDotScale ?? 1.4,
  };
  const { width } = useWindowDimensions();
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const opacityOutputRange = [dp.inactiveDotOpacity, 1, dp.inactiveDotOpacity];
  const scaleOutputRange = [1, dp.activeDotScale, 1];
  const colorOutputRange = [
    dp.inactiveDotColor,
    dp.activeDotColor,
    dp.inactiveDotColor,
  ];
  const extrapolation = {
    extrapolateRight: Extrapolation.CLAMP,
    extrapolateLeft: Extrapolation.CLAMP,
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      inputRange,
      opacityOutputRange,
      extrapolation,
    ),
    backgroundColor: interpolateColor(
      scrollX.value,
      inputRange,
      colorOutputRange,
    ),
    transform: [
      {
        scale: interpolate(
          scrollX.value,
          inputRange,
          scaleOutputRange,
          extrapolation,
        ),
      },
    ],
  }));

  return (
    <Animated.View
      key={`dot-${index}`}
      style={[styles.dotStyle, dotStyle, animatedStyle]}
    />
  );
};

const styles = StyleSheet.create({
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default ScalingDot;

import React from "react";
import { useWindowDimensions } from "react-native";
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

const ExpandingDot: React.FC<Props> = ({
  scrollX,
  index,
  dotStyle,
  inactiveDotOpacity = 0.5,
  inactiveDotColor = "#347af0",
  expandingDotWidth = 32,
  activeDotColor = "#347af0",
}) => {
  const { width } = useWindowDimensions();
  const dotWidth = (dotStyle?.width as number) || 16;

  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const animatedDotStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(scrollX.value, inputRange, [
      inactiveDotColor,
      activeDotColor,
      inactiveDotColor,
    ]);

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [inactiveDotOpacity, 1, inactiveDotOpacity],
      Extrapolation.CLAMP,
    );

    const width = interpolate(
      scrollX.value,
      inputRange,
      [dotWidth, expandingDotWidth, dotWidth],
      Extrapolation.CLAMP,
    );

    return {
      backgroundColor,
      opacity,
      width,
    };
  });

  return (
    <Animated.View
      style={[dotStyle, animatedDotStyle]}
      className="mx-1 h-3 w-3 rounded-md"
    />
  );
};

export default ExpandingDot;

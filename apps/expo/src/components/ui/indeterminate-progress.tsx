import React, { useEffect } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { cn } from "~/lib/utils";

const { width } = Dimensions.get("window");

interface IndeterminateProgressBarProps {
  className?: string;
  indicatorClassName?: string;
  indicatorWidth?: number;
  duration?: number;
}

const IndeterminateProgressBar: React.FC<IndeterminateProgressBarProps> = ({
  className,
  indicatorClassName,
  indicatorWidth = width / 2,
  duration = 1200,
}) => {
  const translateX = useSharedValue(-indicatorWidth);

  useEffect(() => {
    translateX.value = withRepeat(
      withDelay(
        duration / 2,
        withTiming(width, {
          duration,
          easing: Easing.ease,
        }),
      ),
      -1,
      false,
    );
  }, [translateX, duration]);

  const indicator = useAnimatedStyle(() => ({
    width: indicatorWidth,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className={cn("h-1 w-full bg-secondary", className)}>
      <Animated.View
        style={indicator}
        className={cn("h-full bg-blue-500", indicatorClassName)}
      />
    </View>
  );
};

export { IndeterminateProgressBar };

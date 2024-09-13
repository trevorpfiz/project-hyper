import React from "react";
import { useWindowDimensions, View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
  Extrapolation,
  interpolate,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import PagingDots from "~/components/paging/paging-dots";
import usePagerScrollHandler from "~/hooks/use-page-scroll-handler";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const OverviewPager = (props: { children: React.ReactNode }) => {
  const { children } = props;

  const { width } = useWindowDimensions();
  const ref = React.useRef<PagerView>(null);
  const positionSharedValue = useSharedValue(0);
  const scrollOffsetSharedValue = useSharedValue(0);

  const widgetCount = React.Children.count(children);

  const scrollX = useDerivedValue(() => {
    const interpolatedValue = interpolate(
      positionSharedValue.value + scrollOffsetSharedValue.value,
      [0, widgetCount],
      [0, widgetCount * width],
      {
        extrapolateRight: Extrapolation.CLAMP,
      },
    );

    return interpolatedValue;
  });

  const handler = usePagerScrollHandler({
    onPageScroll: (e) => {
      "worklet";
      positionSharedValue.value = e.position;
      scrollOffsetSharedValue.value = e.offset;
    },
  });

  return (
    <View className="flex-1 flex-col gap-4">
      <AnimatedPagerView
        initialPage={0}
        ref={ref}
        style={{ flex: 1 }}
        onPageScroll={handler}
        orientation="horizontal"
      >
        {React.Children.map(children, (child, index) => (
          <View key={index} className="flex-1 justify-center">
            {child}
          </View>
        ))}
      </AnimatedPagerView>
      <View>
        <PagingDots count={widgetCount} scrollX={scrollX} dotType="expanding" />
      </View>
    </View>
  );
};

export { OverviewPager };

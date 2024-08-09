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
import { Text } from "~/components/ui/text";
import usePagerScrollHandler from "~/hooks/use-page-scroll-handler";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const INTRO_DATA = [
  {
    key: "1",
    title: "App showcase ✨",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    key: "2",
    title: "Introduction screen 🎉",
    description:
      "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. ",
  },
  {
    key: "3",
    title: "And can be anything 🎈",
    description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ",
  },
];

const OverviewPager = () => {
  const { width } = useWindowDimensions();
  const ref = React.useRef<PagerView>(null);
  const positionSharedValue = useSharedValue(0);
  const scrollOffsetSharedValue = useSharedValue(0);

  const scrollX = useDerivedValue(() => {
    const interpolatedValue = interpolate(
      positionSharedValue.value + scrollOffsetSharedValue.value,
      [0, INTRO_DATA.length],
      [0, INTRO_DATA.length * width],
      {
        extrapolateRight: Extrapolation.CLAMP,
      },
    );

    return interpolatedValue;
  });

  const handler = usePagerScrollHandler({
    onPageScroll: (e: any) => {
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
        useNext={false}
      >
        {INTRO_DATA.map(({ key }) => (
          <View
            key={key}
            className="content-center items-center justify-center p-5"
          >
            <Text>{`Page Index: ${key}`}</Text>
          </View>
        ))}
      </AnimatedPagerView>
      <View>
        <PagingDots data={INTRO_DATA} scrollX={scrollX} dotType="expanding" />
      </View>
    </View>
  );
};

export { OverviewPager };

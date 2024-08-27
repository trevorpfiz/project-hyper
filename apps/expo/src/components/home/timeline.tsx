import { useCallback, useEffect, useRef } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import type { MockActivityData } from "~/data/activity";
import { TimelineItem } from "~/components/home/timeline-item";
import { mockActivityData } from "~/data/activity";
import { useActivityStore } from "~/stores/activity-store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Timeline() {
  const listRef = useRef<Animated.FlatList<MockActivityData> | null>(null);
  const scrollX = useSharedValue(0);
  const { selectedActivity, setSelectedActivity } = useActivityStore();
  const lastIndex = useRef(-1);

  const updateSelectedActivity = useCallback(
    (index: number) => {
      if (index !== lastIndex.current) {
        const activity = mockActivityData[index];
        if (activity) {
          setSelectedActivity({
            ...activity,
            hour:
              new Date(activity.dateTime).getHours() +
              new Date(activity.dateTime).getMinutes() / 60,
          });
          lastIndex.current = index;
        }
      }
    },
    [setSelectedActivity],
  );

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.x / SCREEN_WIDTH);
      runOnJS(updateSelectedActivity)(index);
    },
  });

  useEffect(() => {
    // Set initial selected activity only if it hasn't been set yet
    if (!selectedActivity) {
      updateSelectedActivity(0);
    }
  }, [selectedActivity, updateSelectedActivity]);

  const renderItem = useCallback(
    ({ item, index }: { item: MockActivityData; index: number }) => {
      return <TimelineItem item={item} index={index} scrollX={scrollX} />;
    },
    [scrollX],
  );

  const keyExtractor = useCallback(
    (item: MockActivityData) => item.dateTime,
    [],
  );

  return (
    <View className="flex-1">
      <Animated.FlatList
        ref={listRef}
        data={mockActivityData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: 0,
        }}
      />
    </View>
  );
}

import type { FlatList } from "react-native-reanimated/lib/typescript/Animated";
import { useCallback, useRef } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import type { MockActivityData } from "~/data/activity";
import { TimelineItem } from "~/components/home/timeline-item";
import { mockActivityData } from "~/data/activity";

export default function Timeline() {
  const listRef = useRef<FlatList<MockActivityData> | null>(null);
  const scrollX = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

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
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: 0,
        }}
      />
    </View>
  );
}

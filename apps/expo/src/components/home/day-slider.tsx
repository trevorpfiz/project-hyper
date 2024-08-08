import React, { useCallback, useRef } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { format } from "date-fns";

import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { useDateStore } from "~/stores/dateStore";

const mockScoreData = [
  { date: new Date(2024, 6, 29), score: 75 },
  { date: new Date(2024, 6, 30), score: 82 },
  { date: new Date(2024, 6, 31), score: 58 },
  { date: new Date(2024, 7, 1), score: 93 },
  { date: new Date(2024, 7, 2), score: 69 },
  { date: new Date(2024, 7, 3), score: 87 },
  { date: new Date(2024, 7, 4), score: 45 },
  { date: new Date(2024, 7, 5), score: 91 },
  { date: new Date(2024, 7, 6), score: 63 },
  { date: new Date(2024, 7, 7), score: 79 },
];

export type ScoreData = (typeof mockScoreData)[number];

const screenWidth = Dimensions.get("window").width;
const itemWidth = 48; // 12 (width) + 4 (separator) * 3
const centerOffset = (screenWidth - itemWidth) / 2;
const lastIndex = mockScoreData.length - 1;

const DayItem = React.memo(
  ({
    item,
    isSelected,
    onPress,
  }: {
    item: ScoreData;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <Pressable onPress={onPress} className="h-20 w-16">
      <View className="flex-col items-center gap-1">
        <View
          className={cn(
            "h-6 w-6 items-center justify-center rounded-full",
            isSelected && "bg-primary",
          )}
        >
          <Text
            className={cn(
              "text-xs font-semibold text-gray-400",
              isSelected ? "text-black" : "text-gray-400",
            )}
          >
            {format(item.date, "EEEEE").toUpperCase()}
          </Text>
        </View>

        <View className="h-12 w-12 items-center justify-center rounded-full bg-green-900">
          <Text className="text-xl font-semibold">{item.score}</Text>
        </View>
      </View>
    </Pressable>
  ),
);

export function DaySlider() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const listRef = useRef<FlashList<ScoreData> | null>(null);

  const scrollToIndex = (index: number) => {
    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // This centers the item
    });
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ScoreData; index: number }) => {
      const isSelected =
        item.date.toDateString() === selectedDate.toDateString();
      return (
        <DayItem
          item={item}
          isSelected={isSelected}
          onPress={() => {
            setSelectedDate(item.date);
            scrollToIndex(index);
          }}
        />
      );
    },
    [selectedDate, setSelectedDate],
  );

  const keyExtractor = useCallback(
    (item: ScoreData) => item.date.toISOString(),
    [],
  );

  return (
    <FlashList
      ref={listRef}
      data={mockScoreData}
      extraData={selectedDate}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={48}
      horizontal
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={lastIndex}
      //   ItemSeparatorComponent={() => <View className="w-4" />}
      contentContainerStyle={{
        paddingBottom: 4,
        paddingTop: 4,
        paddingLeft: 8,
        paddingRight: centerOffset,
      }}
    />
  );
}

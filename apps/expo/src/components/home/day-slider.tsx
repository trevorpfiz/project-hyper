import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { format, parseISO } from "date-fns";

import type { ScoresData } from "~/data/scores";
import { Text } from "~/components/ui/text";
import { mockScoresData } from "~/data/scores";
import { useColorScheme } from "~/lib/use-color-scheme";
import { cn, getScoreColors } from "~/lib/utils";
import { useDateStore } from "~/stores/date-store";

const screenWidth = Dimensions.get("window").width;
// IMPORTANT: w-16 = 4rem = 14 (default rem value in nativewind) * 4 = 56
const itemWidth = 56;
const centerOffset = (screenWidth - itemWidth) / 2;

const DayItem = React.memo(
  ({
    item,
    isSelected,
    onPress,
    isDark,
  }: {
    item: ScoresData;
    isSelected: boolean;
    onPress: () => void;
    isDark: boolean;
  }) => {
    const date = parseISO(item.date);
    const scoreColors = getScoreColors(item.value, isDark);

    return (
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
                "text-xs font-semibold",
                isSelected ? "text-secondary" : "text-gray-400",
              )}
            >
              {format(date, "EEEEE").toUpperCase()}
            </Text>
          </View>

          <View
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{
              backgroundColor: scoreColors.background,
            }}
          >
            <Text
              className="text-xl font-semibold"
              style={{
                color: scoreColors.text,
              }}
            >
              {item.value}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  },
);

export function DaySlider() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const listRef = useRef<FlashList<ScoresData> | null>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const sortedData = useMemo(() => {
    return [...mockScoresData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, []);

  //   const scrollToIndex = useCallback((index: number) => {
  //     listRef.current?.scrollToIndex({
  //       index,
  //       animated: true,
  //       viewPosition: 0.5, // This centers the item
  //     });
  //   }, []);

  const scrollToOffset = useCallback((index: number) => {
    const offset = index * itemWidth;
    listRef.current?.scrollToOffset({
      offset,
      animated: true,
    });
  }, []);

  const scrollToSelectedDate = useCallback(() => {
    const selectedIndex = sortedData.findIndex(
      (item) =>
        parseISO(item.date).toDateString() === selectedDate.toDateString(),
    );

    if (selectedIndex !== -1) {
      // scrollToIndex(selectedIndex);
      scrollToOffset(selectedIndex);
    }
  }, [selectedDate, scrollToOffset, sortedData]);

  useEffect(() => {
    scrollToSelectedDate();
  }, [selectedDate, scrollToSelectedDate]);

  const renderItem = useCallback(
    ({ item }: { item: ScoresData }) => {
      const itemDate = parseISO(item.date);
      const isSelected =
        itemDate.toDateString() === selectedDate.toDateString();
      return (
        <DayItem
          item={item}
          isSelected={isSelected}
          onPress={() => {
            setSelectedDate(itemDate);
          }}
          isDark={isDark}
        />
      );
    },
    [selectedDate, setSelectedDate, isDark],
  );

  const keyExtractor = useCallback((item: ScoresData) => item.date, []);

  return (
    <FlashList
      ref={listRef}
      data={sortedData}
      extraData={selectedDate}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={56}
      estimatedListSize={{ height: 78, width: screenWidth }}
      estimatedFirstItemOffset={centerOffset}
      horizontal
      showsHorizontalScrollIndicator={false}
      disableHorizontalListHeightMeasurement={false}
      inverted
      //   ItemSeparatorComponent={() => <View className="w-4" />}
      contentContainerStyle={{
        paddingBottom: 4,
        paddingTop: 4,
        paddingLeft: centerOffset,
        paddingRight: centerOffset,
      }}
    />
  );
}

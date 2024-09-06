import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { endOfDay, format, startOfDay } from "date-fns";

import type { DailyRecap, GlucoseRangeTypes } from "@hyper/db/schema";

import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/use-color-scheme";
import { cn, getGlucoseRangeColors } from "~/lib/utils";
import { useDateStore } from "~/stores/date-store";
import { useGlucoseStore } from "~/stores/glucose-store";
import { api } from "~/utils/api";

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
    rangeView,
  }: {
    item: DailyRecap;
    isSelected: boolean;
    onPress: () => void;
    isDark: boolean;
    rangeView: GlucoseRangeTypes;
  }) => {
    const date = new Date(item.date);
    const glucoseColors = getGlucoseRangeColors(
      item.timeInRanges?.[rangeView] ?? 0,
      isDark,
    );

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
              backgroundColor: glucoseColors.background,
            }}
          >
            <Text
              className="text-xl font-semibold"
              style={{
                color: glucoseColors.text,
              }}
            >
              {item.timeInRanges?.[rangeView] ?? "?"}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  },
);

export function DaySlider() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const { rangeView } = useGlucoseStore();
  const listRef = useRef<FlashList<DailyRecap> | null>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Fetch data for the last 30 days
  const endDate = endOfDay(new Date());
  const startDate = startOfDay(
    new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000),
  );

  const { data: dailyRecaps, isPending } = api.recap.getDailyRecaps.useQuery({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const sortedData = useMemo(() => {
    return dailyRecaps
      ? [...dailyRecaps].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
      : [];
  }, [dailyRecaps]);

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
        new Date(item.date).toDateString() === selectedDate.toDateString(),
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
    ({ item }: { item: DailyRecap }) => {
      const itemDate = new Date(item.date);
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
          rangeView={rangeView}
        />
      );
    },
    [selectedDate, setSelectedDate, isDark, rangeView],
  );

  const keyExtractor = useCallback(
    (item: DailyRecap) => item.date.toDateString(),
    [],
  );

  if (isPending) {
    return <Text>Loading...</Text>;
  }

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

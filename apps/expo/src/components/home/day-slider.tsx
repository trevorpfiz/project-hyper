import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { DateTime } from "luxon";

import type { DailyRecap, GlucoseRangeTypes } from "@stable/db/schema";

import { Skeleton } from "~/components/ui/skeleton";
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
    date,
    recap,
    isSelected,
    onPress,
    isDark,
    rangeView,
    isLoading,
  }: {
    date: DateTime;
    recap?: DailyRecap;
    isSelected: boolean;
    onPress: () => void;
    isDark: boolean;
    rangeView: GlucoseRangeTypes;
    isLoading: boolean;
  }) => {
    const timeInRange = recap?.timeInRanges?.[rangeView];
    const glucoseColors = getGlucoseRangeColors(timeInRange, isDark);

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
              {date.toFormat("ccccc").toUpperCase()}
            </Text>
          </View>

          {isLoading ? (
            <Skeleton className="h-12 w-12 rounded-full" />
          ) : (
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
                {timeInRange !== undefined ? Math.floor(timeInRange) : "-"}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  },
);

export function DaySlider() {
  const { selectedDate, setSelectedDate, visibleDates, formatDate } =
    useDateStore();
  const { rangeView } = useGlucoseStore();
  const listRef = useRef<FlashList<DateTime> | null>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { data: allRecaps, isPending } = api.recap.all.useQuery();

  const recapsMap = useMemo(() => {
    const map = new Map<string, DailyRecap>();
    allRecaps?.forEach((recap) => {
      const recapDate = DateTime.fromJSDate(recap.date, {
        zone: recap.timezone,
      });
      const dateKey = recapDate.toFormat("yyyy-MM-dd");
      map.set(dateKey, recap);
    });
    return map;
  }, [allRecaps]);

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
    const selectedIndex = visibleDates.findIndex((date) =>
      date.hasSame(selectedDate, "day"),
    );

    if (selectedIndex !== -1) {
      // scrollToIndex(selectedIndex);
      scrollToOffset(selectedIndex);
    }
  }, [selectedDate, scrollToOffset, visibleDates]);

  useEffect(() => {
    scrollToSelectedDate();
  }, [selectedDate, scrollToSelectedDate]);

  const renderItem = useCallback(
    ({ item: date }: { item: DateTime }) => {
      const dateString = date.toFormat("yyyy-MM-dd");
      const isSelected = date.hasSame(selectedDate, "day");
      const recap = recapsMap.get(dateString);
      const isLoading = !recap && isPending;

      return (
        <DayItem
          date={date}
          recap={recap}
          isSelected={isSelected}
          onPress={() => {
            setSelectedDate(date);
          }}
          isDark={isDark}
          rangeView={rangeView}
          isLoading={isLoading}
        />
      );
    },
    [selectedDate, setSelectedDate, isDark, rangeView, recapsMap, isPending],
  );

  const keyExtractor = useCallback(
    (date: DateTime) => formatDate(date),
    [formatDate],
  );

  return (
    <FlashList
      ref={listRef}
      data={visibleDates}
      extraData={[selectedDate, isDark, rangeView, recapsMap]}
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

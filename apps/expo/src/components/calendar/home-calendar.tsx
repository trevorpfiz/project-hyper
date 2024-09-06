import type {
  CalendarActiveDateRange,
  CalendarOnDayPress,
} from "@marceloterreiro/flash-calendar";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { fromDateId, toDateId } from "@marceloterreiro/flash-calendar";
import { add, endOfMonth, format, startOfMonth, sub } from "date-fns";
import { format as formatFP } from "date-fns/fp";

import { BasicCalendar } from "~/components/calendar/basic-calendar";
import { Text } from "~/components/ui/text";
import { useDateStore } from "~/stores/date-store";
import { useGlucoseStore } from "~/stores/glucose-store";
import { api } from "~/utils/api";

export function HomeCalendar() {
  const { selectedDate, setSelectedDate, setIsCalendarOpen } = useDateStore();
  const { rangeView } = useGlucoseStore();
  const [currentCalendarMonth, setCurrentCalendarMonth] =
    useState(selectedDate);

  const startDate = startOfMonth(selectedDate);
  const endDate = endOfMonth(selectedDate);

  const { data: dailyRecaps, isPending } = api.recap.getDailyRecaps.useQuery({
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  });

  const currentDate = new Date();

  const handleDayPress = useCallback<CalendarOnDayPress>(
    (dateId) => {
      setCurrentCalendarMonth(fromDateId(dateId));
      setSelectedDate(fromDateId(dateId));
      setIsCalendarOpen(false); // Close the dialog after selecting a date
    },
    [setSelectedDate, setIsCalendarOpen],
  );

  const calendarActiveDateRanges = useMemo<CalendarActiveDateRange[]>(
    () => [
      {
        startId: toDateId(selectedDate),
        endId: toDateId(selectedDate),
      },
    ],
    [selectedDate],
  );

  const handlePreviousMonth = useCallback(() => {
    setCurrentCalendarMonth(sub(currentCalendarMonth, { months: 1 }));
  }, [currentCalendarMonth]);

  const handleNextMonth = useCallback(() => {
    setCurrentCalendarMonth(add(currentCalendarMonth, { months: 1 }));
  }, [currentCalendarMonth]);

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="flex-1">
      <BasicCalendar
        calendarActiveDateRanges={calendarActiveDateRanges}
        calendarDisabledDateIds={[]}
        calendarMinDateId="2024-07-11"
        calendarMaxDateId={toDateId(currentDate)}
        calendarMonthId={toDateId(currentCalendarMonth)}
        calendarRowVerticalSpacing={4}
        getCalendarWeekDayFormat={formatFP("E")}
        calendarFirstDayOfWeek="sunday"
        onCalendarDayPress={handleDayPress}
        // extends
        onNextMonthPress={handleNextMonth}
        onPreviousMonthPress={handlePreviousMonth}
        dailyRecaps={dailyRecaps ?? []}
        rangeView={rangeView}
      />
    </View>
  );
}

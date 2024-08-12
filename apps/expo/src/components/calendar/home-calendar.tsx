import type {
  CalendarActiveDateRange,
  CalendarOnDayPress,
} from "@marceloterreiro/flash-calendar";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { fromDateId, toDateId } from "@marceloterreiro/flash-calendar";
import { add, sub } from "date-fns";
import { format } from "date-fns/fp";

import { BasicCalendar } from "~/components/calendar/basic-calendar";
import { useDateStore } from "~/stores/dateStore";

export function HomeCalendar() {
  const { selectedDate, setSelectedDate, setIsCalendarOpen } = useDateStore();
  const [currentCalendarMonth, setCurrentCalendarMonth] =
    useState(selectedDate);

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

  return (
    <View className="py-safe max-h-96 flex-1 px-1">
      <BasicCalendar
        calendarActiveDateRanges={calendarActiveDateRanges}
        calendarDisabledDateIds={[]}
        calendarMinDateId="2024-07-11"
        calendarMaxDateId={toDateId(currentDate)} // current date
        calendarMonthId={toDateId(currentCalendarMonth)}
        calendarRowVerticalSpacing={4}
        getCalendarWeekDayFormat={format("E")}
        calendarFirstDayOfWeek="sunday"
        onCalendarDayPress={handleDayPress}
        onNextMonthPress={handleNextMonth}
        onPreviousMonthPress={handlePreviousMonth}
      />
    </View>
  );
}

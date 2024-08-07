import type {
  CalendarActiveDateRange,
  CalendarOnDayPress,
} from "@marceloterreiro/flash-calendar";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { fromDateId, toDateId } from "@marceloterreiro/flash-calendar";
import { add, sub } from "date-fns";
import { format } from "date-fns/fp";

import { BasicCalendar } from "~/components/calendar";

export function HomeCalendar() {
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(
    sub(new Date(), { days: 1 }),
  );

  const handleDayPress = useCallback<CalendarOnDayPress>((dateId) => {
    setCurrentCalendarMonth(fromDateId(dateId));
    setSelectedDate(fromDateId(dateId));
  }, []);

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
    <View>
      <BasicCalendar
        calendarActiveDateRanges={calendarActiveDateRanges}
        calendarMonthId={toDateId(currentCalendarMonth)}
        getCalendarWeekDayFormat={format("E")}
        calendarFirstDayOfWeek="sunday"
        onCalendarDayPress={handleDayPress}
        onNextMonthPress={handleNextMonth}
        onPreviousMonthPress={handlePreviousMonth}
      />
    </View>
  );
}

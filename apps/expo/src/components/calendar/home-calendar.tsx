import type {
  CalendarActiveDateRange,
  CalendarOnDayPress,
} from "@marceloterreiro/flash-calendar";
import { useCallback, useMemo, useState } from "react";
import { fromDateId, toDateId } from "@marceloterreiro/flash-calendar";
import { add, sub } from "date-fns";
import { format as formatFP } from "date-fns/fp";
import { DateTime } from "luxon";

import { BasicCalendar } from "~/components/calendar/basic-calendar";
import { useDateStore } from "~/stores/date-store";
import { useGlucoseStore } from "~/stores/glucose-store";
import { api } from "~/utils/api";

export function HomeCalendar() {
  const {
    selectedDate,
    setSelectedDate,
    setIsCalendarOpen,
    updateVisibleDates,
  } = useDateStore();
  const { rangeView } = useGlucoseStore();
  const [currentCalendarMonth, setCurrentCalendarMonth] =
    useState(selectedDate);

  const { data: allRecaps } = api.recap.all.useQuery();

  const currentDate = DateTime.local();
  const minDate = allRecaps
    ? DateTime.fromMillis(
        Math.min(
          ...allRecaps.map((recap) => DateTime.fromISO(recap.date).toMillis()),
        ),
      )
    : DateTime.fromISO("2024-08-01");

  const handleDayPress = useCallback<CalendarOnDayPress>(
    (dateId) => {
      const newDate = fromDateId(dateId);
      setCurrentCalendarMonth(newDate);
      setSelectedDate(newDate);
      updateVisibleDates(newDate);
      setIsCalendarOpen(false); // Close the dialog after selecting a date
    },
    [setSelectedDate, setIsCalendarOpen, updateVisibleDates],
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
    <BasicCalendar
      calendarActiveDateRanges={calendarActiveDateRanges}
      calendarDisabledDateIds={[]}
      calendarMinDateId={toDateId(minDate)}
      calendarMaxDateId={toDateId(currentDate)}
      calendarMonthId={toDateId(currentCalendarMonth)}
      calendarRowVerticalSpacing={4}
      getCalendarWeekDayFormat={formatFP("E")}
      calendarFirstDayOfWeek="sunday"
      onCalendarDayPress={handleDayPress}
      // extends
      onNextMonthPress={handleNextMonth}
      onPreviousMonthPress={handlePreviousMonth}
      dailyRecaps={allRecaps ?? []}
      rangeView={rangeView}
    />
  );
}

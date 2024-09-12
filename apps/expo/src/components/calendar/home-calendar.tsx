import type {
  CalendarActiveDateRange,
  CalendarOnDayPress,
} from "@marceloterreiro/flash-calendar";
import { useCallback, useMemo, useState } from "react";
import { fromDateId, toDateId } from "@marceloterreiro/flash-calendar";
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

  const currentDate = DateTime.local().startOf("day");
  const minDate = allRecaps
    ? DateTime.min(
        ...allRecaps.map((recap) =>
          DateTime.fromJSDate(recap.date).startOf("day"),
        ),
      )
    : DateTime.fromISO("2024-08-01").startOf("day");

  const handleDayPress = useCallback<CalendarOnDayPress>(
    (dateId) => {
      const newDate = fromDateId(dateId);
      const newDateTime = DateTime.fromJSDate(newDate);
      setCurrentCalendarMonth(newDateTime);
      setSelectedDate(newDateTime);
      updateVisibleDates(newDateTime);
      setIsCalendarOpen(false); // Close the dialog after selecting a date
    },
    [setSelectedDate, setIsCalendarOpen, updateVisibleDates],
  );

  const calendarActiveDateRanges = useMemo<CalendarActiveDateRange[]>(
    () => [
      {
        startId: toDateId(selectedDate.toJSDate()),
        endId: toDateId(selectedDate.toJSDate()),
      },
    ],
    [selectedDate],
  );

  const handlePreviousMonth = useCallback(() => {
    setCurrentCalendarMonth(currentCalendarMonth.minus({ months: 1 }));
  }, [currentCalendarMonth]);

  const handleNextMonth = useCallback(() => {
    setCurrentCalendarMonth(currentCalendarMonth.plus({ months: 1 }));
  }, [currentCalendarMonth]);

  return (
    <BasicCalendar
      calendarActiveDateRanges={calendarActiveDateRanges}
      calendarDisabledDateIds={[]}
      calendarMinDateId={toDateId(minDate.toJSDate())}
      calendarMaxDateId={toDateId(currentDate.toJSDate())}
      calendarMonthId={toDateId(currentCalendarMonth.toJSDate())}
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

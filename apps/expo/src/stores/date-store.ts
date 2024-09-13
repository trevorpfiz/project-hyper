import { DateTime, Interval } from "luxon";
import { create } from "zustand";

interface DateState {
  selectedDate: DateTime;
  setSelectedDate: (date: DateTime) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
  visibleDates: DateTime[];
  updateVisibleDates: (date: DateTime) => void;
  formatDate: (date: DateTime) => string;
}

const formatDate = (date: DateTime) => {
  return date.isValid
    ? date.startOf("day").toFormat("yyyy-MM-dd")
    : "Invalid Date";
};

const generateDates = (start: DateTime, end: DateTime) => {
  // Include the end date in the interval
  const inclusiveEnd = end.plus({ days: 1 });

  return Interval.fromDateTimes(start, inclusiveEnd)
    .splitBy({ days: 1 })
    .map((interval) => interval.start)
    .filter((d) => d instanceof DateTime)
    .reverse();
};

const generateInitialDates = () => {
  const today = DateTime.local().startOf("day");
  const start = today.minus({ days: 29 });
  return generateDates(start, today);
};

const generateDatesOutsideRange = (centerDate: DateTime) => {
  const endDate = centerDate.plus({ days: 15 }).startOf("day");
  const startDate = endDate.minus({ days: 30 });
  return generateDates(startDate, endDate);
};

export const useDateStore = create<DateState>((set) => ({
  selectedDate: DateTime.local().startOf("day"),
  setSelectedDate: (date: DateTime) =>
    set({
      selectedDate: date.isValid
        ? date.startOf("day")
        : DateTime.local().startOf("day"),
    }),
  isCalendarOpen: false,
  setIsCalendarOpen: (isOpen: boolean) => set({ isCalendarOpen: isOpen }),
  visibleDates: generateInitialDates(),
  updateVisibleDates: (date: DateTime) =>
    set(() => {
      if (!date.isValid) {
        return { visibleDates: generateInitialDates() };
      }

      const today = DateTime.local().startOf("day");
      const thirtyDaysAgo = today.minus({ days: 29 });

      if (date >= thirtyDaysAgo && date <= today) {
        // Case 1: Date is within the last 30 days or is today
        return { visibleDates: generateInitialDates() };
      } else {
        // Case 2: Date is outside the last 30 days
        return { visibleDates: generateDatesOutsideRange(date) };
      }
    }),
  formatDate,
}));

// Example persist-middleware with MMKV
// export const useDateStore = create<DateState>()(
//   persist(
//     (set) => ({
//       selectedDate: new Date(),
//       setSelectedDate: (date: Date) => set({ selectedDate: date }),
//     }),
//     {
//       name: "date-storage", // unique name
//       storage: createJSONStorage(() => zustandStorage),
//     },
//   ),
// );

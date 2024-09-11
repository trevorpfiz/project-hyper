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

const formatDate = (date: DateTime) =>
  date.startOf("day").toFormat("yyyy-MM-dd");

const generateInitialDates = () => {
  const today = DateTime.local().startOf("day");
  return Interval.fromDateTimes(today.minus({ days: 29 }), today)
    .splitBy({ days: 1 })
    .map((d) => d.start)
    .reverse();
};

const generateDatesOutsideRange = (centerDate: DateTime) => {
  const endDate = centerDate.plus({ days: 15 }).startOf("day");
  return Interval.fromDateTimes(endDate.minus({ days: 30 }), endDate)
    .splitBy({ days: 1 })
    .map((d) => d.start);
};

export const useDateStore = create<DateState>((set) => ({
  selectedDate: DateTime.local().startOf("day"),
  setSelectedDate: (date: DateTime) =>
    set({ selectedDate: date.startOf("day") }),
  isCalendarOpen: false,
  setIsCalendarOpen: (isOpen: boolean) => set({ isCalendarOpen: isOpen }),
  visibleDates: generateInitialDates(),
  updateVisibleDates: (date: DateTime) =>
    set(() => {
      const today = DateTime.local().startOf("day");
      const thirtyDaysAgo = today.minus({ days: 30 });

      if (
        date.hasSame(today, "day") ||
        (date < today && date > thirtyDaysAgo)
      ) {
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

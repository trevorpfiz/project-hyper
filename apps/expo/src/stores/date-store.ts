import { addDays, isAfter, isBefore, isSameDay, subDays } from "date-fns";
import { create } from "zustand";

interface DateState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
  visibleDates: Date[];
  updateVisibleDates: (date: Date) => void;
}

const generateInitialDates = () => {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => subDays(today, i));
};

const generateDatesOutsideRange = (centerDate: Date) => {
  const endDate = addDays(centerDate, 15);
  return Array.from({ length: 31 }, (_, i) => subDays(endDate, i));
};

export const useDateStore = create<DateState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date: Date) => set({ selectedDate: date }),
  isCalendarOpen: false,
  setIsCalendarOpen: (isOpen: boolean) => set({ isCalendarOpen: isOpen }),
  visibleDates: generateInitialDates(),
  updateVisibleDates: (date: Date) =>
    set(() => {
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);

      if (
        isSameDay(date, today) ||
        (isBefore(date, today) && isAfter(date, thirtyDaysAgo))
      ) {
        // Case 1: Date is within the last 30 days or is today
        return { visibleDates: generateInitialDates() };
      } else {
        // Case 2: Date is outside the last 30 days
        return { visibleDates: generateDatesOutsideRange(date) };
      }
    }),
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

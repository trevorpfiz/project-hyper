import { create } from "zustand";

interface DateState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
}

export const useDateStore = create<DateState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date: Date) => set({ selectedDate: date }),
  isCalendarOpen: false,
  setIsCalendarOpen: (isOpen: boolean) => set({ isCalendarOpen: isOpen }),
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

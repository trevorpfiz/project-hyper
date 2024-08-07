import { create } from "zustand";

interface DateState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const useDateStore = create<DateState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date: Date) => set({ selectedDate: date }),
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

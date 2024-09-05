import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { GlucoseRangeTypes } from "@hyper/db/schema";

import { zustandStorage } from "~/lib/storage";

type RangeView = "standard" | "tight" | "optimal";

interface GlucoseState {
  rangeView: GlucoseRangeTypes;
  lastSyncedTime: Date | null;
  setRangeView: (view: RangeView) => void;
  setLastSyncedTime: (date: Date) => void;
}

export const useGlucoseStore = create<GlucoseState>()(
  persist(
    (set) => ({
      rangeView: "tight",
      lastSyncedTime: null,
      setRangeView: (view) => set({ rangeView: view }),
      setLastSyncedTime: (date) => set({ lastSyncedTime: date }),
    }),
    {
      name: "glucose-storage",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

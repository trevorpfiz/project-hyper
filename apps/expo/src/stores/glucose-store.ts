import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { GlucoseRangeTypes } from "@hyper/db/schema";

import { zustandStorage } from "~/lib/storage";

interface GlucoseState {
  rangeView: GlucoseRangeTypes;
  lastSyncedTime: Date | null;
  setRangeView: (view: GlucoseRangeTypes) => void;
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

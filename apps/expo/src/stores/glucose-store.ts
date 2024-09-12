import type { DateTime } from "luxon";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { GlucoseRangeTypes } from "@hyper/db/schema";

import { zustandStorage } from "~/lib/storage";

interface GlucoseState {
  rangeView: GlucoseRangeTypes;
  lastSyncedTime: string | null;
  setRangeView: (view: GlucoseRangeTypes) => void;
  setLastSyncedTime: (date: DateTime) => void;
}

export const useGlucoseStore = create<GlucoseState>()(
  persist(
    (set) => ({
      rangeView: "tight",
      lastSyncedTime: null,
      setRangeView: (view) => set({ rangeView: view }),
      setLastSyncedTime: (date) =>
        set({ lastSyncedTime: date.toUTC().toISO() }),
    }),
    {
      name: "glucose-storage",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

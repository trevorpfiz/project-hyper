import type { DateTime } from "luxon";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { GlucoseRangeTypes } from "@stable/db/schema";

import { zustandStorage } from "~/lib/storage";

interface GlucoseState {
  rangeView: GlucoseRangeTypes;
  lastSyncedTime: string | null;
  userTimezone: string;
  setRangeView: (view: GlucoseRangeTypes) => void;
  setLastSyncedTime: (date: DateTime) => void;
  resetLastSyncedTime: () => void;
  setUserTimezone: (timezone: string) => void;
}

export const useGlucoseStore = create<GlucoseState>()(
  persist(
    (set) => ({
      rangeView: "tight",
      lastSyncedTime: null,
      userTimezone: "UTC", // Default to UTC
      setRangeView: (view) => set({ rangeView: view }),
      setLastSyncedTime: (date) =>
        set({ lastSyncedTime: date.toUTC().toISO() }),
      resetLastSyncedTime: () => set({ lastSyncedTime: null }),
      setUserTimezone: (timezone) => set({ userTimezone: timezone }),
    }),
    {
      name: "glucose-storage",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

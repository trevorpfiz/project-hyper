import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandStorage } from "~/lib/storage";

interface SyncState {
  lastSyncedTime: Date | null;
  setLastSyncedTime: (date: Date) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      lastSyncedTime: null,
      setLastSyncedTime: (date: Date) => set({ lastSyncedTime: date }),
    }),
    {
      name: "sync-storage", // unique name
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

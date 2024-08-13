import { create } from "zustand";

import type { MockActivityData } from "~/data/activity";

export interface ProcessedActivityData extends MockActivityData {
  hour: number;
}

interface ActivityState {
  selectedActivity: ProcessedActivityData | null;
  setSelectedActivity: (activity: ProcessedActivityData | null) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  selectedActivity: null,
  setSelectedActivity: (activity) => set({ selectedActivity: activity }),
}));

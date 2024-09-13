export const mockMacrosData = {
  calories: { label: "Calories", value: 912, unit: "cal", shortLabel: "Cal" },
  protein: { label: "Protein", value: 41, unit: "g", shortLabel: "P" },
  fat: { label: "Fat", value: 28, unit: "g", shortLabel: "F" },
  carbs: { label: "Carbs", value: 72, unit: "g", shortLabel: "C" },
  fiber: { label: "Fiber", value: 6, unit: "g", shortLabel: "Fb" },
  sugar: { label: "Sugar", value: 41, unit: "g", shortLabel: "S" },
  addedSugar: { label: "Added Sugar", value: 0, unit: "g", shortLabel: "AS" },
  foodItems: 3,
  logs: 2,
};
export type MacrosData = typeof mockMacrosData;
export type MacrosKeys = keyof MacrosData;
export type MacroItem = MacrosData[Exclude<MacrosKeys, "foodItems" | "logs">];

import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { CALENDAR_THEME } from "~/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dates
export const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${month}/${day}/${year}`;
};

export const getFormattedDateTime = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");

  let hours = today.getHours();
  const minutes = today.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
};

// Glucose
export function getGlucoseRangeColors(timeInRange: number, isDark: boolean) {
  const theme = isDark ? CALENDAR_THEME.dark : CALENDAR_THEME.light;

  if (timeInRange >= 70) return theme.good;
  if (timeInRange >= 50) return theme.ok;
  return theme.bad;
}

export function getBloodSugarColors(value: number, isDark: boolean) {
  const theme = isDark ? CALENDAR_THEME.dark : CALENDAR_THEME.light;

  if (value < 70 || value > 180) return theme.bad;
  if (value >= 70 && value <= 140) return theme.good;
  return theme.ok; // for 140 < value <= 180
}

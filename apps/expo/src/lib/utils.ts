import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { GlucoseRangeTypes } from "@stable/db/schema";

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
export function getGlucoseRangeColors(
  timeInRange: number | undefined,
  isDark: boolean,
) {
  const theme = isDark ? CALENDAR_THEME.dark : CALENDAR_THEME.light;

  if (timeInRange === undefined) {
    return { background: theme.highlight, text: theme.text };
  }

  if (timeInRange >= 70) return theme.good;
  if (timeInRange >= 50) return theme.ok;
  return theme.bad;
}

interface Range {
  veryLow: number;
  low: number;
  high: number;
  veryHigh: number;
}

const ranges: Record<GlucoseRangeTypes, Range> = {
  tight: { veryLow: 70, low: 70, high: 140, veryHigh: 180 },
  standard: { veryLow: 70, low: 70, high: 180, veryHigh: 180 },
  optimal: { veryLow: 70, low: 72, high: 110, veryHigh: 140 },
};

export function getBloodSugarColors(
  value: number,
  isDark: boolean,
  rangeView: GlucoseRangeTypes,
) {
  const theme = isDark ? CALENDAR_THEME.dark : CALENDAR_THEME.light;
  const range = ranges[rangeView];

  if (value < range.veryLow || value > range.veryHigh) return theme.bad;
  if (value >= range.low && value <= range.high) return theme.good;
  return theme.ok;
}

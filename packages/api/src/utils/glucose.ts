import type { TimeInRanges } from "@stable/db/schema";

interface GlucoseReading {
  value: number;
  timestamp: Date;
}

export function calculateTimeInRanges(readings: GlucoseReading[]) {
  const total = readings.length;
  const counts = {
    veryLow: 0, // <54 mg/dL
    low: 0, // 54–69 mg/dL
    lowOptimal: 0, // 54–71 mg/dL
    optimal: 0, // 72-110 mg/dL
    tight: 0, // 70–140 mg/dL
    standard: 0, // 70–180 mg/dL
    highOptimal: 0, // 111–250 mg/dL
    highTight: 0, // 141–250 mg/dL
    high: 0, // 181–250 mg/dL
    veryHigh: 0, // >250 mg/dL
  };

  for (const reading of readings) {
    const value = reading.value;
    if (value < 54) counts.veryLow++;
    if (value < 70) counts.low++;
    if (value >= 54 && value <= 71) counts.lowOptimal++;
    if (value >= 72 && value <= 110) counts.optimal++;
    if (value >= 70 && value <= 140) counts.tight++;
    if (value >= 70 && value <= 180) counts.standard++;
    if (value >= 111 && value <= 250) counts.highOptimal++;
    if (value >= 141 && value <= 250) counts.highTight++;
    if (value >= 181 && value <= 250) counts.high++;
    if (value > 250) counts.veryHigh++;
  }

  return Object.entries(counts).reduce((acc, [key, value]) => {
    acc[key as keyof TimeInRanges] = (value / total) * 100;
    return acc;
  }, {} as TimeInRanges);
}

export function calculateAverageGlucose(readings: GlucoseReading[]) {
  return (
    readings.reduce((sum, reading) => sum + reading.value, 0) / readings.length
  );
}

export function calculateGlucoseVariability(readings: GlucoseReading[]) {
  const mean = calculateAverageGlucose(readings);
  const squaredDiffs = readings.map((r) => Math.pow(r.value - mean, 2));
  const variance =
    squaredDiffs.reduce((sum, diff) => sum + diff, 0) / readings.length;
  return Math.sqrt(variance);
}

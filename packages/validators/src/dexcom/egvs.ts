import { z } from "zod";

// Define enums
const UnitEnum = z.enum(["unknown", "mg/dL", "mmol/L"]);
const RateUnitEnum = z.enum(["unknown", "mg/dL/min", "mmol/L/min"]);
const StatusEnum = z.enum(["unknown", "high", "low", "ok"]);
const TrendEnum = z.enum([
  "none",
  "unknown",
  "doubleUp",
  "singleUp",
  "fortyFiveUp",
  "flat",
  "fortyFiveDown",
  "singleDown",
  "doubleDown",
  "notComputable",
  "rateOutOfRange",
]);
const DisplayDeviceEnum = z.enum(["unknown", "receiver", "iOS", "android"]);
const TransmitterGenerationEnum = z.enum([
  "unknown",
  "g4",
  "g5",
  "g6",
  "g6+",
  "dexcomPro",
  "g7",
]);

// Define the EGV schema
const EGVSchema = z.object({
  recordId: z.string(),
  systemTime: z.string(),
  displayTime: z.string(),
  transmitterId: z.string().nullable(),
  transmitterTicks: z.number().int(),
  value: z.number().int().nullable(),
  status: StatusEnum.nullable(),
  trend: TrendEnum.nullable(),
  trendRate: z.number().nullable(),
  unit: UnitEnum,
  rateUnit: RateUnitEnum,
  displayDevice: DisplayDeviceEnum,
  transmitterGeneration: TransmitterGenerationEnum,
});

// Define the EGVs response schema
const EGVsResponseSchema = z.object({
  recordType: z.literal("egv"),
  recordVersion: z.string(),
  userId: z.string(),
  records: z.array(EGVSchema),
});

export type EGV = z.infer<typeof EGVSchema>;
export type EGVsResponse = z.infer<typeof EGVsResponseSchema>;

export { EGVSchema, EGVsResponseSchema };

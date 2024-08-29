import { z } from "zod";

const TransmitterGenerationEnum = z.enum([
  "unknown",
  "g4",
  "g5",
  "g6",
  "g6+",
  "dexcomPro",
  "g7",
]);
const DisplayDeviceEnum = z.enum(["unknown", "receiver", "iOS", "android"]);
const DaysOfWeekEnum = z.enum([
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]);
const AlertNameEnum = z.enum([
  "unknown",
  "high",
  "low",
  "rise",
  "fall",
  "outOfRange",
  "urgentLow",
  "urgentLowSoon",
  "noReadings",
  "fixedLow",
]);
const UnitEnum = z.enum([
  "mg/dL",
  "mmol/L",
  "mg/dL/min",
  "mmol/L/min",
  "minutes",
]);
const SoundThemeEnum = z.enum(["unknown", "modern", "classic"]);
const SoundOutputModeEnum = z.enum(["unknown", "sound", "vibrate", "match"]);
const OverrideModeEnum = z.enum(["unknown", "quiet", "vibrate"]);

const OverrideSettingSchema = z.object({
  isOverrideEnabled: z.boolean().nullable(),
  mode: OverrideModeEnum.nullable(),
  endTime: z.string().nullable(),
});

const DeviceAlertScheduleSettingsSchema = z.object({
  alertScheduleName: z.string(),
  isEnabled: z.boolean(),
  isDefaultSchedule: z.boolean(),
  startTime: z.string(),
  endTime: z.string(),
  daysOfWeek: z.array(DaysOfWeekEnum),
  isActive: z.boolean().nullable(),
  override: OverrideSettingSchema.optional(),
});

const DeviceAlertSettingSchema = z.object({
  alertName: AlertNameEnum,
  value: z.number().int().nullable(),
  unit: UnitEnum.nullable(),
  snooze: z.number().int().nullable(),
  enabled: z.boolean(),
  systemTime: z.string().datetime().nullable(),
  displayTime: z.string().datetime().nullable(),
  delay: z.number().int().nullable(),
  secondaryTriggerCondition: z.number().int().nullable(),
  soundTheme: SoundThemeEnum.nullable(),
  soundOutputMode: SoundOutputModeEnum.nullable(),
});

const DeviceSchema = z.object({
  lastUploadDate: z.string().datetime(),
  transmitterId: z.string().nullable(),
  transmitterGeneration: TransmitterGenerationEnum,
  displayDevice: DisplayDeviceEnum,
  displayApp: z.string().nullable(),
  alertSchedules: z.array(
    z.object({
      alertScheduleSettings: DeviceAlertScheduleSettingsSchema,
    }),
  ),
  alertSettings: z.array(DeviceAlertSettingSchema),
});

const DevicesResponseSchema = z.object({
  recordType: z.literal("device"),
  recordVersion: z.string(),
  userId: z.string(),
  records: z.array(DeviceSchema),
});

export type Device = z.infer<typeof DeviceSchema>;
export type DevicesResponse = z.infer<typeof DevicesResponseSchema>;

export { DeviceSchema, DevicesResponseSchema };

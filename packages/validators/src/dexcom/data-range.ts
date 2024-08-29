import { z } from "zod";

// Define the DataRangeMoment schema
const DataRangeMomentSchema = z.object({
  systemTime: z.string().datetime(),
  displayTime: z.string().datetime(),
});

// Define the DataRangeStartAndEnd schema
const DataRangeStartAndEndSchema = z.object({
  start: DataRangeMomentSchema,
  end: DataRangeMomentSchema,
});

// Define the DataRange response schema
const DataRangeResponseSchema = z.object({
  recordType: z.literal("dataRange"),
  recordVersion: z.string(),
  userId: z.string(),
  calibrations: DataRangeStartAndEndSchema.optional(),
  egvs: DataRangeStartAndEndSchema.optional(),
  events: DataRangeStartAndEndSchema.optional(),
});

export type DataRangeMoment = z.infer<typeof DataRangeMomentSchema>;
export type DataRangeStartAndEnd = z.infer<typeof DataRangeStartAndEndSchema>;
export type DataRangeResponse = z.infer<typeof DataRangeResponseSchema>;

export {
  DataRangeMomentSchema,
  DataRangeStartAndEndSchema,
  DataRangeResponseSchema,
};

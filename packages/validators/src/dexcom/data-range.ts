import { z } from "zod";

const customDateTimeSchema = z.string().refine(
  (value) => {
    // This regex allows ISO 8601 format with or without milliseconds and with or without UTC offset
    const regex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;
    return regex.test(value);
  },
  {
    message:
      "Invalid datetime format. Expected ISO 8601 format (with or without milliseconds, with or without UTC offset).",
  },
);

const DataRangeMomentSchema = z.object({
  systemTime: customDateTimeSchema,
  displayTime: customDateTimeSchema,
});

const DataRangeStartAndEndSchema = z.object({
  start: DataRangeMomentSchema,
  end: DataRangeMomentSchema,
});

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

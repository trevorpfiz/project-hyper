import { relations } from "drizzle-orm";
import { index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { createTable } from "./_table";
import { Profile } from "./profile";

export const CGMData = createTable(
  "cgm_data",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    dexcomUserId: t.varchar({ length: 255 }).notNull(),
    recordId: t.varchar({ length: 255 }).notNull().unique(),
    systemTime: t.timestamp({ withTimezone: true }).notNull(),
    displayTime: t.timestamp({ withTimezone: true }).notNull(),
    transmitterId: t.varchar({ length: 255 }),
    transmitterTicks: t.integer().notNull(),
    glucoseValue: t.integer(),
    status: t.varchar({ length: 20 }),
    trend: t.varchar({ length: 20 }),
    trendRate: t.doublePrecision(),
    unit: t.varchar({ length: 10 }).notNull(),
    rateUnit: t.varchar({ length: 20 }).notNull(),
    displayDevice: t.varchar({ length: 20 }).notNull(),
    transmitterGeneration: t.varchar({ length: 20 }).notNull(),
    profileId: t
      .uuid()
      .notNull()
      .references(() => Profile.id),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .$onUpdateFn(() => new Date()),
  }),
  (table) => [
    index("cgm_data_profile_id_idx").on(table.profileId),
    uniqueIndex("cgm_data_record_id_idx").on(table.recordId),
  ],
);

export const CGMDataRelations = relations(CGMData, ({ one }) => ({
  profile: one(Profile, {
    fields: [CGMData.profileId],
    references: [Profile.id],
  }),
}));

// Schema for inserting CGM data
export const insertCGMDataSchema = createInsertSchema(CGMData, {
  glucoseValue: (schema) => schema.glucoseValue.positive(),
  transmitterTicks: (schema) => schema.transmitterTicks.positive(),
});

// Schema for selecting CGM data
export const selectCGMDataSchema = createSelectSchema(CGMData);

// Create a type for CGMDataPoint based on the select schema
export type CGMDataPoint = z.infer<typeof selectCGMDataSchema>;

// Create a schema for the query input
export const cgmDataQueryInputSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

// Type for the query input
export type CGMDataQueryInput = z.infer<typeof cgmDataQueryInputSchema>;

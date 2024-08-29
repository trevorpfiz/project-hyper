import { relations } from "drizzle-orm";
import {
  doublePrecision,
  integer,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { createTable } from "./_table";
import { Profile } from "./profile";

export const CGMData = createTable("cgm_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  dexcomUserId: varchar("dexcom_user_id", { length: 255 }).notNull(),
  recordId: varchar("record_id", { length: 255 }).notNull().unique(),
  systemTime: timestamp("system_time", { withTimezone: true }).notNull(),
  displayTime: timestamp("display_time", { withTimezone: true }).notNull(),
  transmitterId: varchar("transmitter_id", { length: 255 }),
  transmitterTicks: integer("transmitter_ticks").notNull(),
  glucoseValue: integer("glucose_value"),
  status: varchar("status", { length: 20 }),
  trend: varchar("trend", { length: 20 }),
  trendRate: doublePrecision("trend_rate"),
  unit: varchar("unit", { length: 10 }).notNull(),
  rateUnit: varchar("rate_unit", { length: 20 }).notNull(),
  displayDevice: varchar("display_device", { length: 20 }).notNull(),
  transmitterGeneration: varchar("transmitter_generation", {
    length: 20,
  }).notNull(),

  profileId: uuid("profile_id")
    .notNull()
    .references(() => Profile.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => new Date()),
});

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

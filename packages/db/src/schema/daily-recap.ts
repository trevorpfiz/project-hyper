import type { z } from "zod";
import { relations } from "drizzle-orm";
import {
  date,
  integer,
  jsonb,
  numeric,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamps } from "../lib/utils";
import { createTable } from "./_table";
import { Profile } from "./profile";

export interface TimeInRanges {
  veryLow: number; // <54 mg/dL and <1%
  low: number; // 54–69 mg/dL and <4%
  lowOptimal: number; // 54–71 mg/dL
  optimal: number; // 72-110 mg/dL
  tight: number; // 70–140 mg/dL
  standard: number; // 70–180 mg/dL and >70%
  highOptimal: number; // 111–250 mg/dL
  highTight: number; // 141–250 mg/dL
  high: number; // 181–250 mg/dL and <25%
  veryHigh: number; // >250 mg/dL and <5%
}

export const DailyRecap = createTable("daily_recap", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date", { mode: "date" }).notNull(),
  averageGlucose: integer("average_glucose"),
  minimumGlucose: integer("minimum_glucose"),
  maximumGlucose: integer("maximum_glucose"),
  glucoseVariability: numeric("glucose_variability"), // Standard deviation or coefficient of variation
  timeInRanges: jsonb("time_in_ranges").$type<TimeInRanges>(),
  totalReadings: integer("total_readings"),

  profileId: uuid("profile_id")
    .notNull()
    .references(() => Profile.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => new Date()),
});

export const DailyRecapRelations = relations(DailyRecap, ({ one }) => ({
  profile: one(Profile, {
    fields: [DailyRecap.profileId],
    references: [Profile.id],
  }),
}));

// Schema for Daily Recaps - used to validate API requests
const baseSchema = createSelectSchema(DailyRecap).omit(timestamps);

export const insertRecapSchema =
  createInsertSchema(DailyRecap).omit(timestamps);
export const insertRecapParams = insertRecapSchema.extend({}).omit({
  id: true,
  profileId: true,
});

export const updateRecapSchema = baseSchema;
export const updateRecapParams = baseSchema
  .extend({})
  .omit({
    profileId: true,
  })
  .partial()
  .extend({
    id: baseSchema.shape.id,
  });
export const recapIdSchema = baseSchema.pick({ id: true });

// Types for Daily Recaps - used to type API request params and within Components
export type DailyRecap = typeof DailyRecap.$inferSelect;
export type NewRecap = z.infer<typeof insertRecapSchema>;
export type NewRecapParams = z.infer<typeof insertRecapParams>;
export type UpdateRecapParams = z.infer<typeof updateRecapParams>;
export type RecapId = z.infer<typeof recapIdSchema>["id"];

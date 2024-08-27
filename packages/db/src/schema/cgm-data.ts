import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { createTable } from "./_table";
import { Profile } from "./profile";

export const CGMData = createTable("cgm_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  dexcomUserId: varchar("dexcom_user_id", { length: 255 }),
  recordId: varchar("record_id", { length: 255 }).notNull().unique(),
  systemTime: timestamp("system_time").notNull(),
  displayTime: timestamp("display_time").notNull(),
  glucoseValue: integer("glucose_value").notNull(),
  trend: varchar("trend", { length: 50 }),
  trendRate: decimal("trend_rate", { precision: 5, scale: 2 }),
  transmitterId: varchar("transmitter_id", { length: 255 }),
  transmitterGeneration: varchar("transmitter_generation", { length: 50 }),
  displayDevice: varchar("display_device", { length: 50 }),
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

import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { createTable } from "./_table";
import { Users } from "./auth";
import { CGMData } from "./cgm-data";
import { DailyRecap } from "./daily-recap";
import { Report } from "./report";

const glucoseRangeTypes = [
  "standard", // 70-180
  "tight", // 70-140
  "optimal", // 72-110
] as const;
export type GlucoseRangeTypes = (typeof glucoseRangeTypes)[number];
export const glucoseRangeTypeEnum = pgEnum(
  "glucose_range_type",
  glucoseRangeTypes,
);

const diabetesStatus = ["none", "pre", "type1", "type2", "type3"] as const;
export type DiabetesStatus = (typeof diabetesStatus)[number];
export const diabetesStatusEnum = pgEnum("diabetes_status", diabetesStatus);

export const Profile = createTable(
  "profile",
  {
    // Matches id from auth.users table in Supabase
    id: uuid("id")
      .primaryKey()
      .references(() => Users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 256 }).notNull(),
    image: varchar("image", { length: 256 }),
    email: varchar("email", { length: 256 }),
    lastSyncedTime: timestamp("last_synced_time", { withTimezone: true }),
    diabetesStatus: diabetesStatusEnum("diabetes_status")
      .notNull()
      .default("none"),
    glucoseRangeType: glucoseRangeTypeEnum("glucose_range_type")
      .notNull()
      .default("tight"),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.name),
      emailIdx: uniqueIndex("email_idx").on(table.email),
    };
  },
);

export const ProfileRelations = relations(Profile, ({ many }) => ({
  cgmData: many(CGMData),
  dailyRecaps: many(DailyRecap),
  reports: many(Report),
}));

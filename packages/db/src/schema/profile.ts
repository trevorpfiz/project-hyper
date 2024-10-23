import { relations } from "drizzle-orm";
import { index, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";

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
  (t) => ({
    // Matches id from auth.users table in Supabase
    id: t
      .uuid()
      .primaryKey()
      .references(() => Users.id, { onDelete: "cascade" }),
    name: t.varchar({ length: 256 }).notNull(),
    image: t.varchar({ length: 256 }),
    email: t.varchar({ length: 256 }),
    lastSyncedTime: t.timestamp({ withTimezone: true }),
    diabetesStatus: diabetesStatusEnum().notNull().default("none"),
    glucoseRangeType: glucoseRangeTypeEnum().notNull().default("tight"),
  }),
  (table) => ({
    nameIdx: index().on(table.name),
    emailIdx: uniqueIndex().on(table.email),
  }),
);

export const ProfileRelations = relations(Profile, ({ many }) => ({
  cgmData: many(CGMData),
  dailyRecaps: many(DailyRecap),
  reports: many(Report),
}));

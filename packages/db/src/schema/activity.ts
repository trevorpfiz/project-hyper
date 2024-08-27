import { relations } from "drizzle-orm";
import { interval, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { createTable } from "./_table";
import { Profile } from "./profile";

export const Activity = createTable("activity", {
  id: uuid("id").primaryKey().defaultRandom(),
  duration: interval("duration").notNull(),
  activityTypeId: uuid("activity_type_id")
    .notNull()
    .references(() => ActivityType.id),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => Profile.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => new Date()),
});

export const ActivityRelations = relations(Activity, ({ one }) => ({
  activityType: one(ActivityType, {
    fields: [Activity.activityTypeId],
    references: [ActivityType.id],
  }),
  profile: one(Profile, {
    fields: [Activity.profileId],
    references: [Profile.id],
  }),
}));

export const ActivityType = createTable("activity_type", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

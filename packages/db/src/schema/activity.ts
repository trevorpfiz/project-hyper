import { relations } from "drizzle-orm";

import { createTable } from "./_table";
import { Profile } from "./profile";

export const Activity = createTable("activity", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  duration: t.interval().notNull(),
  activityTypeId: t
    .uuid()
    .notNull()
    .references(() => ActivityType.id),
  profileId: t
    .uuid()
    .notNull()
    .references(() => Profile.id),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => new Date()),
}));

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

export const ActivityType = createTable("activity_type", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  name: t.varchar({ length: 50 }).notNull().unique(),
}));

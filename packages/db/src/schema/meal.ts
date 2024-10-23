import { relations } from "drizzle-orm";

import { createTable } from "./_table";
import { Profile } from "./profile";

export const Meal = createTable("meal", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  mealTime: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  carbohydrates: t.doublePrecision(),
  dietaryEnergy: t.doublePrecision(),
  dietarySugar: t.doublePrecision(),
  fiber: t.doublePrecision(),
  protein: t.doublePrecision(),
  totalFat: t.doublePrecision(),
  profileId: t
    .uuid()
    .notNull()
    .references(() => Profile.id),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => new Date()),
}));

export const MealRelations = relations(Meal, ({ one }) => ({
  profile: one(Profile, {
    fields: [Meal.profileId],
    references: [Profile.id],
  }),
}));

import { relations } from "drizzle-orm";
import { doublePrecision, timestamp, uuid } from "drizzle-orm/pg-core";

import { createTable } from "./_table";
import { Profile } from "./profile";

export const Meal = createTable("meal", {
  id: uuid("id").primaryKey().defaultRandom(),
  mealTime: timestamp("meal_time", { withTimezone: true })
    .defaultNow()
    .notNull(),
  carbohydrates: doublePrecision("carbohydrates"),
  dietaryEnergy: doublePrecision("dietary_energy"),
  dietarySugar: doublePrecision("dietary_sugar"),
  fiber: doublePrecision("fiber"),
  protein: doublePrecision("protein"),
  totalFat: doublePrecision("total_fat"),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => Profile.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => new Date()),
});

export const MealRelations = relations(Meal, ({ one }) => ({
  profile: one(Profile, {
    fields: [Meal.profileId],
    references: [Profile.id],
  }),
}));

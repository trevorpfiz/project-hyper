import { relations } from "drizzle-orm";
import { decimal, timestamp, uuid } from "drizzle-orm/pg-core";

import { createTable } from "./_table";
import { Profile } from "./profile";

export const Meal = createTable("meal", {
  id: uuid("id").primaryKey().defaultRandom(),
  mealTime: timestamp("meal_time").defaultNow().notNull(),
  carbohydrates: decimal("carbohydrates", { precision: 10, scale: 2 }),
  dietaryEnergy: decimal("dietary_energy", { precision: 10, scale: 2 }),
  dietarySugar: decimal("dietary_sugar", { precision: 10, scale: 2 }),
  fiber: decimal("fiber", { precision: 10, scale: 2 }),
  protein: decimal("protein", { precision: 10, scale: 2 }),
  totalFat: decimal("total_fat", { precision: 10, scale: 2 }),
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

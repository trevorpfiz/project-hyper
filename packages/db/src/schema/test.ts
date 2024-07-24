import type { z } from "zod";
import { text, timestamp, uuid, varchar, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

import { timestamps } from "../lib/utils";
import { createTable } from "./_table";

export const User = createTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => new Date()),
});

export const userRelations = relations(User, ({ many }) => ({
  reports: many(Report),
}));

export const Report = createTable("report", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content"),
  test: varchar("test", { length: 256 }),  // New field added
  userId: uuid("user_id").notNull().references(() => User.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => new Date()),
});

export const reportRelations = relations(Report, ({ one }) => ({
  user: one(User, {
    fields: [Report.userId],
    references: [User.id],
  }),
}));

// Schema for Reports - used to validate API requests
const baseSchema = createSelectSchema(Report).omit(timestamps);

export const insertReportSchema = createInsertSchema(Report).omit(timestamps);
export const insertReportParams = insertReportSchema.extend({}).omit({
  id: true,
  userId: true,
});

export const updateReportSchema = baseSchema;
export const updateReportParams = baseSchema
  .extend({})
  .omit({
    userId: true,
  })
  .partial()
  .extend({
    id: baseSchema.shape.id,
  });
export const reportIdSchema = baseSchema.pick({ id: true });

// Types for Reports - used to type API request params and within Components
export type Report = typeof Report.$inferSelect;
export type NewReport = z.infer<typeof insertReportSchema>;
export type NewReportParams = z.infer<typeof insertReportParams>;
export type UpdateReportParams = z.infer<typeof updateReportParams>;
export type ReportId = z.infer<typeof reportIdSchema>["id"];

// Schema for Users
const userBaseSchema = createSelectSchema(User).omit(timestamps);

export const insertUserSchema = createInsertSchema(User).omit(timestamps);
export const insertUserParams = insertUserSchema.extend({}).omit({
  id: true,
});

export const updateUserSchema = userBaseSchema;
export const updateUserParams = userBaseSchema
  .extend({})
  .partial()
  .extend({
    id: userBaseSchema.shape.id,
  });
export const userIdSchema = userBaseSchema.pick({ id: true });

// Types for Users
export type User = typeof User.$inferSelect;
export type NewUser = z.infer<typeof insertUserSchema>;
export type NewUserParams = z.infer<typeof insertUserParams>;
export type UpdateUserParams = z.infer<typeof updateUserParams>;
export type UserId = z.infer<typeof userIdSchema>["id"];

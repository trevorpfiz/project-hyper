import type { z } from "zod";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamps } from "../lib/utils";
import { createTable } from "./_table";
import { Profile } from "./profile";

export const Report = createTable("report", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  reportType: t.varchar({ length: 50 }).notNull(),
  startTime: t.timestamp({ withTimezone: true }).notNull(),
  endTime: t.timestamp({ withTimezone: true }).notNull(),
  generatedAt: t.timestamp({ withTimezone: true }).notNull(),
  profileId: t
    .uuid()
    .notNull()
    .references(() => Profile.id),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => new Date()),
}));

export const ReportRelations = relations(Report, ({ one }) => ({
  profile: one(Profile, {
    fields: [Report.profileId],
    references: [Profile.id],
  }),
}));

// Schema for Reports - used to validate API requests
const baseSchema = createSelectSchema(Report).omit(timestamps);

export const insertReportSchema = createInsertSchema(Report).omit(timestamps);
export const insertReportParams = insertReportSchema.extend({}).omit({
  id: true,
  profileId: true,
});

export const updateReportSchema = baseSchema;
export const updateReportParams = baseSchema
  .extend({})
  .omit({
    profileId: true,
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

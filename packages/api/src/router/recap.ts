import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { NewRecapParams, TimeInRanges } from "@stable/db/schema";
import { and, desc, eq, gte, lte } from "@stable/db";
import {
  CGMData,
  DailyRecap,
  insertRecapParams,
  updateRecapParams,
} from "@stable/db/schema";

import { protectedProcedure } from "../trpc";
import { DateRangeSchema } from "../utils/dexcom";

import "../utils/";

import { DateTime } from "luxon";

import { conflictUpdateAllExcept } from "../utils/drizzle";
import {
  calculateAverageGlucose,
  calculateGlucoseVariability,
  calculateTimeInRanges,
} from "../utils/glucose";

export const recapRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const rows = await ctx.db.query.DailyRecap.findMany({
      where: eq(DailyRecap.profileId, userId),
      orderBy: desc(DailyRecap.date),
    });

    return rows;
  }),

  getDailyRecaps: protectedProcedure
    .input(DateRangeSchema)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = input;
      const userId = ctx.user.id;

      const rows = await ctx.db.query.DailyRecap.findMany({
        where: and(
          eq(DailyRecap.profileId, userId),
          gte(DailyRecap.date, new Date(startDate)),
          lte(DailyRecap.date, new Date(endDate)),
        ),
        orderBy: desc(DailyRecap.date),
      });

      return rows;
    }),

  getLatestRecap: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const row = await ctx.db.query.DailyRecap.findFirst({
      where: eq(DailyRecap.profileId, userId),
      orderBy: desc(DailyRecap.date),
    });

    return row;
  }),

  calculateAndStoreRecapsForRange: protectedProcedure
    .input(
      z.object({
        startDate: z.string().datetime({ offset: true }),
        endDate: z.string().datetime({ offset: true }).optional(),
        timezone: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { startDate, endDate, timezone } = input;
      const userId = ctx.user.id;

      // Convert input dates to UTC, considering the user's timezone
      const startDateUTC = DateTime.fromISO(startDate, {
        zone: timezone,
      }).toUTC();
      const endDateUTC = endDate
        ? DateTime.fromISO(endDate, { zone: timezone }).toUTC()
        : undefined;

      // Fetch EGVs for the date range
      const storedEGVs = await ctx.db
        .select()
        .from(CGMData)
        .where(
          and(
            gte(CGMData.systemTime, startDateUTC.toJSDate()),
            endDateUTC
              ? lte(CGMData.systemTime, endDateUTC.toJSDate())
              : undefined,
            eq(CGMData.profileId, userId),
          ),
        )
        .orderBy(desc(CGMData.systemTime));

      // Group EGVs by date in user's timezone
      const egvsByDate = storedEGVs.reduce(
        (acc, egv) => {
          if (egv.glucoseValue !== null) {
            const zonedDate = DateTime.fromJSDate(egv.systemTime, {
              zone: "UTC",
            }).setZone(timezone);
            const dateKey = zonedDate.startOf("day").toISO() ?? "";
            if (!acc[dateKey]) {
              acc[dateKey] = [];
            }
            acc[dateKey].push({
              value: egv.glucoseValue,
              timestamp: egv.systemTime,
            });
          }
          return acc;
        },
        {} as Record<string, { value: number; timestamp: Date }[]>,
      );

      const recapsToUpsert: NewRecapParams[] = [];

      // Calculate recap for each date
      for (const [dateKey, readings] of Object.entries(egvsByDate)) {
        const zonedDate = DateTime.fromISO(dateKey, { zone: timezone });
        const timeInRanges = calculateTimeInRanges(readings);
        const averageGlucose = Math.round(calculateAverageGlucose(readings));
        const glucoseVariability =
          calculateGlucoseVariability(readings).toFixed(2);

        const totalReadings = readings.length;
        const minimumGlucose = Math.min(...readings.map((r) => r.value));
        const maximumGlucose = Math.max(...readings.map((r) => r.value));

        recapsToUpsert.push({
          date: zonedDate.toJSDate(),
          timezone,
          averageGlucose,
          minimumGlucose,
          maximumGlucose,
          glucoseVariability,
          timeInRanges,
          totalReadings,
        });
      }

      // Create a schema for an array of recaps
      const recapsArraySchema = z.array(insertRecapParams);

      // Validate recapsToUpsert
      const validatedRecaps = recapsArraySchema.parse(recapsToUpsert);

      // Upsert all recaps
      const result = await ctx.db
        .insert(DailyRecap)
        .values(
          validatedRecaps.map((recap) => ({
            ...recap,
            timeInRanges: recap.timeInRanges as TimeInRanges,
            profileId: userId,
          })),
        )
        .onConflictDoUpdate({
          target: [DailyRecap.date, DailyRecap.profileId],
          set: conflictUpdateAllExcept(DailyRecap, [
            "id",
            "date",
            "createdAt",
            "updatedAt",
          ]),
        })
        .returning();

      if (!result.length) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create or update recaps",
        });
      }

      return result;
    }),

  createRecap: protectedProcedure
    .input(insertRecapParams)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const [recap] = await ctx.db
        .insert(DailyRecap)
        .values({
          ...input,
          timeInRanges: input.timeInRanges as TimeInRanges,
          profileId: userId,
        })
        .returning();

      return recap;
    }),

  updateRecap: protectedProcedure
    .input(updateRecapParams)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const userId = ctx.user.id;

      const [recap] = await ctx.db
        .update(DailyRecap)
        .set({
          ...updateData,
          // FIXME: related to https://github.com/drizzle-team/drizzle-orm/pull/1785
          timeInRanges: updateData.timeInRanges as TimeInRanges,
        })
        .where(and(eq(DailyRecap.id, id), eq(DailyRecap.profileId, userId)))
        .returning();

      if (!recap) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recap not found or you don't have permission to update it",
        });
      }

      return recap;
    }),

  deleteRecap: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.user.id;

      const data = await ctx.db.query.DailyRecap.findFirst({
        where: eq(DailyRecap.id, id),
      });

      if (data?.profileId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only the owner is allowed to delete this",
        });
      }

      const [r] = await ctx.db
        .delete(DailyRecap)
        .where(and(eq(DailyRecap.id, id), eq(DailyRecap.profileId, userId)))
        .returning();

      return { recap: r };
    }),
} satisfies TRPCRouterRecord;

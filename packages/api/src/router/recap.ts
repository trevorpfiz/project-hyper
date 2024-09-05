import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { TimeInRanges } from "@hyper/db/schema";
import { and, desc, eq, gte, lte } from "@hyper/db";
import {
  DailyRecap,
  insertRecapParams,
  updateRecapParams,
} from "@hyper/db/schema";

import { protectedProcedure } from "../trpc";
import { DateRangeSchema } from "../utils/dexcom";

export const recapRouter = {
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

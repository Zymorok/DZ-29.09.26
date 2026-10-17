import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Отримання статистики поточного гравця
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return {
        totalGames: 0,
        winsX: 0,
        winsO: 0,
        draws: 0,
      };
    }

    const statsDoc = await ctx.db
      .query("stats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!statsDoc) {
      return {
        totalGames: 0,
        winsX: 0,
        winsO: 0,
        draws: 0,
      };
    }

    return statsDoc;
  },
});

// 2. Оновлення результату гри для поточного гравця
export const recordGameResult = mutation({
  args: {
    result: v.union(v.literal("X"), v.literal("O"), v.literal("DRAW")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    const statsDoc = await ctx.db
      .query("stats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!statsDoc) {
      await ctx.db.insert("stats", {
        userId,
        totalGames: 1,
        winsX: args.result === "X" ? 1 : 0,
        winsO: args.result === "O" ? 1 : 0,
        draws: args.result === "DRAW" ? 1 : 0,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(statsDoc._id, {
        totalGames: statsDoc.totalGames + 1,
        winsX: args.result === "X" ? statsDoc.winsX + 1 : statsDoc.winsX,
        winsO: args.result === "O" ? statsDoc.winsO + 1 : statsDoc.winsO,
        draws: args.result === "DRAW" ? statsDoc.draws + 1 : statsDoc.draws,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// 3. Скидання статистики поточного гравця
export const resetStats = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    const statsDoc = await ctx.db
      .query("stats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (statsDoc) {
      await ctx.db.patch(statsDoc._id, {
        totalGames: 0,
        winsX: 0,
        winsO: 0,
        draws: 0,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("stats", {
        userId,
        totalGames: 0,
        winsX: 0,
        winsO: 0,
        draws: 0,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});
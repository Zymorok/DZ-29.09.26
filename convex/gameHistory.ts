import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";



// 1. Запис завершеної партії в історію + оновлення лічильників у stats
export const recordHistory = mutation({
  args: {
    winner: v.union(v.literal("X"), v.literal("O"), v.literal("DRAW")),
    board: v.array(v.union(v.string(), v.null())),
    winnerCombination: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {

    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError("Користувач не авторизований");
    }

    // 1.1. Додаємо партію в таблицю games
    const gameId = await ctx.db.insert("gameHistory", {
      userId,
      winner: args.winner,
      board: args.board,
      winnerCombination: args.winnerCombination,
      createdAt: Date.now(),
    });

    return gameId;
  },
});

export const getHistory = query({
    args: {},
    handler: async (ctx) => {

    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    return await ctx.db.query('gameHistory')
      .withIndex('by_user_creation', (q) => q.eq('userId', userId))
      .order('desc')
      .take(20)
    }
})

// 3. Видалення окремого запису гри (Mutation)
export const deleteHistory = mutation({
  args: {
    id: v.id("gameHistory"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    const history = await ctx.db.get(args.id);
    if (!history) {
      throw new ConvexError("Гру не знайдено");
    }

    // Перевірка прав доступу: гра повинна належати саме цьому гравцю
    if (history.userId !== userId) {
      throw new ConvexError("Немає прав на видалення цього запису");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// 4. Повне очищення історії ігор (Mutation)
export const clearAllHistory = mutation({
  args: {},
  handler: async (ctx) => {

    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    // const allGames = await ctx.db.query("gameHistory")
    //   .filter((q) => q.eq(q.field("userId"), userId))
    //   .collect();

    const userGames = await ctx.db
      .query("gameHistory")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const game of userGames) {
      await ctx.db.delete(game._id);
    }
    return { success: true };
  },
});

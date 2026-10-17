import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listRooms = query({
  args: {},
  handler: async (ctx) => {
    if ((await getAuthUserId(ctx)) === null) return [];
    return await ctx.db.query("chatRooms").order("desc").collect();
  },
});

export const getRoom = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    if ((await getAuthUserId(ctx)) === null) return null;
    const roomId = ctx.db.normalizeId("chatRooms", args.roomId);
    return roomId ? await ctx.db.get(roomId) : null;
  },
});

export const createRoom = mutation({
  args: { title: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Потрібно увійти в акаунт");
    const title = args.title.trim();
    const description = args.description?.trim();
    if (!title || title.length > 100) {
      throw new ConvexError("Назва має містити від 1 до 100 символів");
    }
    if (description && description.length > 300) {
      throw new ConvexError("Опис має містити до 300 символів");
    }
    return await ctx.db.insert("chatRooms", {
      title,
      description: description || undefined,
      creatorId: userId,
      lastMessageAt: Date.now(),
    });
  },
});

export const deleteRoom = mutation({
  args: { roomId: v.id("chatRooms") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Потрібно увійти в акаунт");
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new ConvexError("Кімнату не знайдено");
    if (room.creatorId !== userId) {
      throw new ConvexError("Тільки автор може видалити кімнату");
    }
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat_room", (q) => q.eq("chatRoomId", args.roomId))
      .collect();
    for (const message of messages) await ctx.db.delete(message._id);
    await ctx.db.delete(args.roomId);
  },
});

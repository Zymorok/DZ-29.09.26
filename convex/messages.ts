import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listMessages = query({
  args: { chatRoomId: v.string() },
  handler: async (ctx, args) => {
    if ((await getAuthUserId(ctx)) === null) return [];
    const roomId = ctx.db.normalizeId("chatRooms", args.chatRoomId);
    if (!roomId || !(await ctx.db.get(roomId))) return [];
    return await ctx.db
      .query("messages")
      .withIndex("by_chat_room", (q) => q.eq("chatRoomId", roomId))
      .order("asc")
      .collect();
  },
});

export const sendMessage = mutation({
  args: { chatRoomId: v.id("chatRooms"), content: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Потрібно увійти в акаунт");
    const user = await ctx.db.get(userId);
    if (!user) throw new ConvexError("Користувача не знайдено");
    if (!(await ctx.db.get(args.chatRoomId))) {
      throw new ConvexError("Кімнату вже видалено");
    }
    const content = args.content.trim();
    if (!content || content.length > 2000) {
      throw new ConvexError("Повідомлення має містити від 1 до 2000 символів");
    }
    const messageId = await ctx.db.insert("messages", {
      chatRoomId: args.chatRoomId,
      senderId: userId,
      senderName: user.name || user.email || "Гравець",
      senderPhoto: user.image,
      content,
    });
    await ctx.db.patch(args.chatRoomId, {
      lastMessage: content,
      lastMessageAt: Date.now(),
    });
    return messageId;
  },
});

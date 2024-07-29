import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getAuthData, getUserByClerkId } from "./utils";
import { days } from "./schema";

export const get = query({
  handler: async (ctx) => {
    const { clerk_id } = await getAuthData(ctx);
    const user = await getUserByClerkId(ctx, { clerk_id });

    return await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .unique();
  },
});

export const create = internalMutation({
  args: {
    clerk_id: v.string(),
    days,
  },
  handler: async (ctx, { clerk_id, days }) => {
    const user = await getUserByClerkId(ctx, { clerk_id });
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .unique();

    if (!settings) {
      await ctx.db.insert("settings", {
        user_id: user._id,
        days,
      });

      return await ctx.db
        .query("settings")
        .withIndex("by_user", (q) => q.eq("user_id", user._id))
        .unique();
    }
  },
});

export const upsert = mutation({
  args: {
    days,
  },
  handler: async (ctx, { days }) => {
    const { clerk_id } = await getAuthData(ctx);
    const user = await getUserByClerkId(ctx, { clerk_id });

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .unique();

    if (!settings) {
      await ctx.db.insert("settings", {
        user_id: user._id,
        days,
      });

      return await ctx.db
        .query("settings")
        .withIndex("by_user", (q) => q.eq("user_id", user._id))
        .unique();
    }

    await ctx.db.patch(settings._id, {
      days,
    });

    return await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .unique();
  },
});

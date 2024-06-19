import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Called get preference without authentication present",
      );
    }

    return await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("user_id", identity.tokenIdentifier))
      .unique();
  },
});

export const update = mutation({
  args: {
    start: v.number(),
    end: v.number(),
    days: v.array(v.number()),
  },
  handler: async (ctx, { start, end, days }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Called get preference without authentication present",
      );
    }

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("user_id", identity.tokenIdentifier))
      .unique();

    if (!settings) {
      await ctx.db.insert("settings", {
        user_id: identity.tokenIdentifier,
        start,
        end,
        days,
      });

      return await ctx.db
        .query("settings")
        .withIndex("by_user", (q) => q.eq("user_id", identity.tokenIdentifier))
        .unique();
    }

    await ctx.db.patch(settings._id, {
      start,
      end,
      days,
    });

    return await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("user_id", identity.tokenIdentifier))
      .unique();
  },
});

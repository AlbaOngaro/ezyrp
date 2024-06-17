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

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (user === null) {
      throw new ConvexError("User not found!");
    }

    return await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
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

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (user === null) {
      throw new ConvexError("User not found!");
    }

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("user_id", user._id))
      .unique();

    if (!settings) {
      throw new ConvexError("Settings not found!");
    }

    await ctx.db.patch(settings._id, {
      start,
      end,
      days,
    });
  },
});

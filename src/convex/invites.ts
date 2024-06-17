import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    id: v.id("invites"),
  },
  handler: async (ctx, { id }) => await ctx.db.get(id),
});

export const list = query({
  handler: async (ctx) => await ctx.db.query("invites").collect(),
});

export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    await ctx.db.insert("invites", {
      email,
    });
  },
});

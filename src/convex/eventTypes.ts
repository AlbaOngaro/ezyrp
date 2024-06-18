import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    id: v.id("eventTypes"),
  },
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const list = query({
  handler: async (ctx) => await ctx.db.query("eventTypes").collect(),
});

export const create = mutation({
  args: {
    name: v.string(),
    variant: v.string(),
    description: v.optional(v.string()),
    duration: v.number(),
  },
  handler: async (ctx, { name, variant, description, duration }) => {
    await ctx.db.insert("eventTypes", { name, variant, description, duration });
  },
});

export const update = mutation({
  args: {
    id: v.id("eventTypes"),
    name: v.optional(v.string()),
    variant: v.optional(v.string()),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, { id, name, variant, description, duration }) => {
    await ctx.db.patch(id, { name, variant, description, duration });
  },
});

export const remove = mutation({
  args: {
    id: v.id("eventTypes"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const list = query({
  handler: async (ctx) => await ctx.db.query("events").collect(),
});

export const create = mutation({
  args: {
    end: v.string(),
    start: v.string(),
    title: v.string(),
    notes: v.optional(v.string()),
    variant: v.string(),
    guests: v.array(v.id("customers")),
  },
  handler: async (ctx, { end, start, title, notes, variant, guests }) => {
    await ctx.db.insert("events", {
      end,
      start,
      title,
      notes,
      variant,
      guests,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    end: v.optional(v.string()),
    start: v.optional(v.string()),
    title: v.optional(v.string()),
    notes: v.optional(v.string()),
    variant: v.optional(v.string()),
    guests: v.optional(v.array(v.id("customers"))),
  },
  handler: async (ctx, { id, end, start, title, notes, variant, guests }) => {
    await ctx.db.patch(id, {
      end,
      start,
      title,
      notes,
      variant,
      guests,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

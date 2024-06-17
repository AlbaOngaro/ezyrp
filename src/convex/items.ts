import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    id: v.id("items"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new ConvexError("Item not found");
    }

    return item;
  },
});

export const list = query({
  handler: async (ctx) => await ctx.db.query("items").collect(),
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    quantity: v.number(),
    onetime: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    { name, description, price, quantity, onetime = false },
  ) => {
    const id = await ctx.db.insert("items", {
      name,
      price,
      onetime,
      quantity,
      description,
    });

    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    id: v.id("items"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    quantity: v.optional(v.number()),
    onetime: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    { id, name, description, price, quantity, onetime = false },
  ) => {
    await ctx.db.patch(id, {
      name,
      price,
      onetime,
      quantity,
      description,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("items"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

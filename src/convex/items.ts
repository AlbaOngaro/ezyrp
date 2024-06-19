import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthData } from "./utils";

export const get = query({
  args: {
    id: v.id("items"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const item = await ctx.db
      .query("items")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();

    if (!item) {
      throw new ConvexError("Item not found");
    }

    return item;
  },
});

export const list = query({
  handler: async (ctx) => {
    const { workspace } = await getAuthData(ctx);

    return await ctx.db
      .query("items")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .collect();
  },
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
    const { workspace } = await getAuthData(ctx);

    const id = await ctx.db.insert("items", {
      workspace,
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
    const { workspace } = await getAuthData(ctx);

    const item = await ctx.db
      .query("items")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq("_id", id as string))
      .unique();

    if (!item) {
      throw new ConvexError("Item not found");
    }

    await ctx.db.patch(id, {
      workspace,
      name: name || item.name,
      price: price || item.price,
      onetime: onetime || item.onetime,
      quantity: quantity || item.quantity,
      description: description || item.description,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("items"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const item = await ctx.db
      .query("items")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq("_id", id as string))
      .unique();

    if (!item) {
      throw new ConvexError("Item not found in this workspace");
    }

    await ctx.db.delete(id);
  },
});

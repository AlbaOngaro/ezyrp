import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
} from "./utils";

export const get = query({
  args: {
    id: v.id("items"),
  },
  handler: async (ctx, { id }) => {
    return await getEntityByIdInWorkspace(ctx, {
      id,
      table: "items",
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await getEntitiesInWorkspace(ctx, "items");
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
    const item = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "items",
    });

    await ctx.db.patch(id, {
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
    await getEntityByIdInWorkspace(ctx, {
      id,
      table: "items",
    });

    await ctx.db.delete(id);

    const invoices = await getEntitiesInWorkspace(ctx, "invoices");

    for (const invoice of invoices.filter((invoice) =>
      invoice.items.includes(id),
    )) {
      await ctx.db.patch(invoice._id, {
        items: invoice.items.filter((itemId) => itemId !== id),
      });
    }
  },
});

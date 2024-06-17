import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    id: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.id);
    if (!invoice) {
      throw new ConvexError("Invoice not found");
    }

    const items = await Promise.all(
      invoice.items.map((id) => ctx.db.get(id)),
    ).catch(() => []);
    const customer = await ctx.db.get(invoice.customer).catch(() => null);

    return {
      ...invoice,
      items,
      customer,
    };
  },
});

export const list = query({
  handler: async (ctx) => {
    const docs = await ctx.db.query("invoices").collect();
    if (!docs) {
      throw new ConvexError("Invoices not found");
    }

    const invoices = [];

    for (const doc of docs) {
      const items = await Promise.all(
        doc.items.map((id) => ctx.db.get(id)),
      ).catch(() => []);
      const customer = await ctx.db.get(doc.customer).catch(() => null);
      invoices.push({
        ...doc,
        items,
        customer,
      });
    }

    return invoices;
  },
});

export const create = mutation({
  args: {
    customer: v.id("customers"),
    description: v.string(),
    status: v.string(),
    items: v.array(v.id("items")),
    amount: v.number(),
    due: v.string(),
    emitted: v.string(),
  },
  handler: async (
    ctx,
    { customer, description, status, items, amount, due, emitted },
  ) => {
    await ctx.db.insert("invoices", {
      due,
      items,
      amount,
      status,
      emitted,
      customer,
      description,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("invoices"),
    customer: v.optional(v.id("customers")),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    items: v.optional(v.array(v.id("items"))),
    amount: v.optional(v.number()),
    due: v.optional(v.string()),
    emitted: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { id, customer, description, status, items, amount, due, emitted },
  ) => {
    await ctx.db.patch(id, {
      due,
      items,
      amount,
      status,
      emitted,
      customer,
      description,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("invoices"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

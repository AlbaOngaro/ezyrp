import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { getAuthData } from "./utils";

export const get = query({
  args: {
    id: v.id("invoices"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const invoice = await ctx.db
      .query("invoices")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();

    if (!invoice) {
      throw new ConvexError("Invoice not found");
    }

    const items = await Promise.all(invoice.items.map((id) => ctx.db.get(id)));
    if (!items) {
      throw new ConvexError("Items not found");
    }

    const customer = await ctx.db.get(invoice.customer);
    if (!customer) {
      throw new ConvexError("Customer not found");
    }

    return {
      ...invoice,
      items: items.filter((item) => item !== null) as Doc<"items">[],
      customer,
    };
  },
});

export const list = query({
  handler: async (ctx) => {
    const { workspace } = await getAuthData(ctx);

    const docs = await ctx.db
      .query("invoices")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .collect();
    if (!docs) {
      throw new ConvexError("Invoices not found");
    }

    const invoices = [];

    for (const doc of docs) {
      const items = await Promise.all(doc.items.map((id) => ctx.db.get(id)));
      const customer = await ctx.db.get(doc.customer);
      if (!customer) {
        throw new ConvexError("Customer not found");
      }

      invoices.push({
        ...doc,
        items: items.filter((item) => item !== null) as Doc<"items">[],
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
    const { workspace } = await getAuthData(ctx);

    await ctx.db.insert("invoices", {
      workspace,
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
    const { workspace } = await getAuthData(ctx);

    const invoice = await ctx.db
      .query("invoices")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id as string))
      .unique();
    if (!invoice) {
      throw new ConvexError("Invoice not found");
    }

    await ctx.db.patch(id, {
      workspace,
      due: due || invoice.due,
      items: items || invoice.items,
      amount: amount || invoice.amount,
      status: status || invoice.status,
      emitted: emitted || invoice.emitted,
      customer: customer || invoice.customer,
      description: description || invoice.description,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("invoices"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const invoice = await ctx.db
      .query("invoices")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id as string))
      .unique();

    if (!invoice) {
      throw new ConvexError("Invoice not found in this workspace");
    }

    await ctx.db.delete(id);
  },
});

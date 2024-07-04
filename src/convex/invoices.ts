import { ConvexError, v } from "convex/values";
import { get as getValue } from "lodash";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
  getWorkflowForEvent,
} from "./utils";
import { api } from "./_generated/api";

export const get = query({
  args: {
    id: v.id("invoices"),
  },
  handler: async (ctx, { id }) => {
    const invoice = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "invoices",
    });

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
    const docs = await getEntitiesInWorkspace(ctx, "invoices");

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
    status: v.union(v.literal("due"), v.literal("paid"), v.literal("overdue")),
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

    const workflow = await getWorkflowForEvent(ctx, "invoice:created");
    console.log("workflow", workflow);
    if (workflow && workflow.status === "active") {
      const { email } = await getEntityByIdInWorkspace(ctx, {
        id: customer,
        table: "customers",
      });

      const action = workflow.nodes.find((node) => node.type === "action");

      const template = getValue(
        action,
        "data.settings.template.value.value",
        null,
      );

      if (template && email) {
        await ctx.scheduler.runAfter(0, api.actions.email, {
          template,
          to: email,
        });
      }
    }
  },
});

export const update = mutation({
  args: {
    id: v.id("invoices"),
    customer: v.optional(v.id("customers")),
    description: v.optional(v.string()),
    status: v.union(v.literal("due"), v.literal("paid"), v.literal("overdue")),
    items: v.optional(v.array(v.id("items"))),
    amount: v.optional(v.number()),
    due: v.optional(v.string()),
    emitted: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { id, customer, description, status, items, amount, due, emitted },
  ) => {
    const invoice = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "invoices",
    });

    await ctx.db.patch(id, {
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
    await getEntityByIdInWorkspace(ctx, {
      id,
      table: "invoices",
    });

    await ctx.db.delete(id);
  },
});

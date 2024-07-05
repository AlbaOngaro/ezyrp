import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
  getWorkflowForEvent,
} from "./utils";

import {
  invoiceEvents,
  customerEvents,
  eventEvents,
  action,
  settings,
} from "./schema";

const event = v.union(invoiceEvents, customerEvents, eventEvents);

export type InvoiceEvents = typeof invoiceEvents.type;
export type EventEvents = typeof eventEvents.type;
export type CustomerEvents = typeof customerEvents.type;
export type AnyEvent = typeof event.type;

export type Action = typeof action.type;
export type Settings = typeof settings.type;

export const get = query({
  args: {
    id: v.id("workflows"),
  },
  handler: async (ctx, { id }) => {
    return await getEntityByIdInWorkspace(ctx, {
      id,
      table: "workflows",
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await getEntitiesInWorkspace(ctx, "workflows");
  },
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, { title }) => {
    const { workspace } = await getAuthData(ctx);

    const id = await ctx.db.insert("workflows", {
      title,
      workspace,
      status: "inactive",
      nodes: [],
      edges: [],
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("workflows"),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    title: v.optional(v.string()),
    nodes: v.optional(v.array(v.any())),
    edges: v.optional(v.array(v.any())),
    settings: v.optional(settings),
  },
  handler: async (ctx, { id, status, title, nodes, edges, settings }) => {
    console.log(settings);

    const workflow = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "workflows",
    });

    await ctx.db.patch(workflow._id, {
      title: title || workflow.title,
      nodes: nodes || workflow.nodes,
      edges: edges || workflow.edges,
      status: status || workflow.status,
      settings: settings || workflow.settings,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("workflows"),
  },
  handler: async (ctx, { id }) => {
    await getEntityByIdInWorkspace(ctx, {
      id,
      table: "workflows",
    });

    await ctx.db.delete(id);
  },
});

export const trigger = internalMutation({
  args: {
    args: v.union(
      v.object({
        event: eventEvents,
        entityId: v.id("events"),
      }),
      v.object({
        event: customerEvents,
        entityId: v.id("customers"),
      }),
      v.object({
        event: invoiceEvents,
        entityId: v.id("invoices"),
      }),
    ),
  },
  handler: async (ctx, { args: { event, entityId } }) => {
    console.log({ event, entityId });

    const workflow = await getWorkflowForEvent(ctx, event);
    if (!workflow) {
      return;
    }
  },
});

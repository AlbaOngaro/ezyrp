import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
  getWorkflowForEvent,
} from "./utils";

import { defaultEvents, delayableEvents, action, settings } from "./schema";

const event = v.union(defaultEvents, delayableEvents);

export type DefaultEvent = typeof defaultEvents.type;
export type DelayableEvent = typeof delayableEvents.type;
export type Event = typeof event.type;
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
    event,
    entityId: v.union(v.id("events"), v.id("customers"), v.id("invoices")),
  },
  handler: async (ctx, { event, entityId }) => {
    console.log({ event, entityId });

    const workflow = await getWorkflowForEvent(ctx, event);
    if (!workflow) {
      return;
    }
  },
});

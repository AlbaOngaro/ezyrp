import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
} from "./utils";

import { event, action } from "./schema";

export type Event = typeof event.type;
export type Action = typeof action.type;

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
      settings: {},
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
    settings: v.optional(
      v.object({
        action: v.optional(action),
        event: v.optional(event),
      }),
    ),
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

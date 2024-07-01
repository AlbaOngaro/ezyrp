import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthData } from "./utils";

export const get = query({
  args: {
    id: v.id("workflows"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const item = await ctx.db
      .query("workflows")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();

    if (!item) {
      throw new ConvexError("Workflow not found");
    }

    return item;
  },
});

export const list = query({
  handler: async (ctx) => {
    const { workspace } = await getAuthData(ctx);

    return await ctx.db
      .query("workflows")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .collect();
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
      nodes: [],
      edges: [],
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("workflows"),
    title: v.optional(v.string()),
    nodes: v.optional(v.array(v.any())),
    edges: v.optional(v.array(v.any())),
  },
  handler: async (ctx, { id, title, nodes, edges }) => {
    const { workspace } = await getAuthData(ctx);

    const workflow = await ctx.db
      .query("workflows")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();

    if (!workflow) {
      throw new ConvexError("Workflow not found");
    }

    await ctx.db.patch(workflow._id, {
      title: title || workflow.title,
      nodes: nodes || workflow.nodes,
      edges: edges || workflow.edges,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("workflows"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const workflow = await ctx.db
      .query("workflows")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id as string))
      .unique();

    if (!workflow) {
      throw new ConvexError("Workflow not found in this workspace");
    }

    await ctx.db.delete(id);
  },
});

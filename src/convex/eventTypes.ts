import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthData } from "./utils";

export const get = query({
  args: {
    id: v.id("eventTypes"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const eventType = await ctx.db
      .query("eventTypes")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();

    if (!eventType) {
      throw new ConvexError("Item not found");
    }

    return eventType;
  },
});

export const list = query({
  handler: async (ctx) => {
    const { workspace } = await getAuthData(ctx);

    return await ctx.db
      .query("eventTypes")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    variant: v.string(),
    description: v.optional(v.string()),
    duration: v.number(),
  },
  handler: async (ctx, { name, variant, description, duration }) => {
    const { workspace } = await getAuthData(ctx);

    await ctx.db.insert("eventTypes", {
      workspace,
      name,
      variant,
      description,
      duration,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("eventTypes"),
    name: v.optional(v.string()),
    variant: v.optional(v.string()),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, { id, name, variant, description, duration }) => {
    const { workspace } = await getAuthData(ctx);

    const eventType = await ctx.db
      .query("eventTypes")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq("_id", id as string))
      .unique();

    if (!eventType) {
      throw new ConvexError("Item not found");
    }

    await ctx.db.patch(id, {
      workspace,
      name: name || eventType.name,
      variant: variant || eventType.variant,
      description: description || eventType.description,
      duration: duration || eventType.duration,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("eventTypes"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const eventType = await ctx.db
      .query("eventTypes")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq("_id", id as string))
      .unique();

    if (!eventType) {
      throw new ConvexError("EventType not found in this workspace");
    }

    await ctx.db.delete(id);
  },
});

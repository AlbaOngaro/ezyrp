import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
} from "./utils";

export const get = query({
  args: {
    id: v.id("eventTypes"),
  },
  handler: async (ctx, { id }) => {
    return await getEntityByIdInWorkspace(ctx, {
      id,
      table: "eventTypes",
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await getEntitiesInWorkspace(ctx, "eventTypes");
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
    const eventType = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "eventTypes",
    });

    await ctx.db.patch(id, {
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
    await getEntityByIdInWorkspace(ctx, {
      id,
      table: "eventTypes",
    });

    await ctx.db.delete(id);
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthData, getEntityByIdInWorkspace } from "./utils";
import { variant } from "./schema";

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
    const { workspace, user_id, role } = await getAuthData(ctx);

    return ctx.db
      .query("eventTypes")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) =>
        role === "org:admin" ? true : q.eq(q.field("user_id"), user_id),
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    variant,
    description: v.optional(v.string()),
    duration: v.number(),
    user_id: v.id("users"),
  },
  handler: async (ctx, { name, variant, description, duration, user_id }) => {
    const { workspace } = await getAuthData(ctx);

    return await ctx.db.insert("eventTypes", {
      workspace,
      name,
      variant,
      description,
      duration,
      user_id,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("eventTypes"),
    name: v.optional(v.string()),
    variant: v.optional(variant),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),
    user_id: v.optional(v.id("users")),
  },
  handler: async (
    ctx,
    { id, name, variant, description, duration, user_id },
  ) => {
    const eventType = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "eventTypes",
    });

    await ctx.db.patch(id, {
      name: name || eventType.name,
      variant: variant || eventType.variant,
      description: description || eventType.description,
      duration: duration || eventType.duration,
      user_id: user_id || eventType.user_id,
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

import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getAuthData,
  getEntityByIdInWorkspace,
  getUserByClerkId,
} from "./utils";
import { variant } from "./schema";

export const get = query({
  args: {
    id: v.id("eventTypes"),
  },
  handler: async (ctx, { id }) => {
    const { user_id, ...eventType } = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "eventTypes",
    });

    const user = await ctx.db.get(user_id);
    if (!user) {
      throw new ConvexError("User not found!");
    }

    return {
      ...eventType,
      user,
    };
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
    clerk_id: v.string(),
  },
  handler: async (ctx, { name, variant, description, duration, clerk_id }) => {
    const { workspace } = await getAuthData(ctx);

    const user = await getUserByClerkId(ctx, { clerk_id });

    return await ctx.db.insert("eventTypes", {
      workspace,
      name,
      variant,
      description,
      duration,
      user_id: user._id,
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
    clerk_id: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { id, name, variant, description, duration, clerk_id },
  ) => {
    const eventType = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "eventTypes",
    });

    if (clerk_id) {
      const user = await getUserByClerkId(ctx, { clerk_id });
      await ctx.db.patch(id, {
        name: name || eventType.name,
        variant: variant || eventType.variant,
        description: description || eventType.description,
        duration: duration || eventType.duration,
        user_id: user._id || eventType.user_id,
      });
      return;
    }

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

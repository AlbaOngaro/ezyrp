import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
} from "./utils";

export const search = query({
  args: {
    read: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { read, limit = 5 }) => {
    const { workspace } = await getAuthData(ctx);

    return await ctx.db
      .query("notifications")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => {
        if (read === undefined) {
          return true;
        }

        return q.eq(q.field("read"), read);
      })
      .order("desc")
      .take(limit);
  },
});

export const list = query({
  handler: async (ctx) => {
    return await getEntitiesInWorkspace(ctx, "notifications", "desc");
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    url: v.optional(v.string()),
    body: v.optional(v.string()),
  },
  handler: async (ctx, { title, url, body }) => {
    const { workspace } = await getAuthData(ctx);

    return await ctx.db.insert("notifications", {
      url,
      body,
      title,
      workspace,
      read: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("notifications"),
    read: v.boolean(),
  },
  handler: async (ctx, { id, read }) => {
    await getEntityByIdInWorkspace(ctx, {
      id,
      table: "notifications",
    });

    await ctx.db.patch(id, {
      read,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, { id }) => {
    await getEntityByIdInWorkspace(ctx, {
      id,
      table: "notifications",
    });

    await ctx.db.delete(id);
  },
});

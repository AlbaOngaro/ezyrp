import { ConvexError, v } from "convex/values";
import { v4 as uuid } from "uuid";
import { mutation, query } from "./_generated/server";
import { getAuthData } from "./utils";

export const get = query({
  args: {
    id: v.id("emails"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const item = await ctx.db
      .query("emails")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();

    if (!item) {
      throw new ConvexError("Email template not found");
    }

    return item;
  },
});

export const list = query({
  handler: async (ctx) => {
    const { workspace } = await getAuthData(ctx);

    return await ctx.db
      .query("emails")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .collect();
  },
});

export const create = mutation({
  handler: async (ctx) => {
    const { workspace } = await getAuthData(ctx);

    const id = await ctx.db.insert("emails", {
      workspace,
      body: [
        {
          id: uuid(),
          type: "paragraph",
          style: {
            fontSize: "16px",
            lineHeight: "26px",
          },
          children: [{ text: "Your text here" }],
        },
      ],
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("emails"),
    body: v.any(),
  },
  handler: async (ctx, { id, body }) => {
    const { workspace } = await getAuthData(ctx);

    const email = await ctx.db
      .query("emails")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();

    if (!email) {
      throw new ConvexError("Email template not found");
    }

    await ctx.db.patch(email._id, { body });
  },
});

export const remove = mutation({
  args: {
    id: v.id("emails"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const email = await ctx.db
      .query("emails")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id as string))
      .unique();

    if (!email) {
      throw new ConvexError("Email not found in this workspace");
    }

    await ctx.db.delete(id);
  },
});

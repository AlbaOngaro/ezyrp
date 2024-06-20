import { ConvexError, v } from "convex/values";
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
          id: "container:1",
          type: "container",
          style: {
            margin: "0 auto",
            padding: "20px 0 48px",
          },
          children: [
            {
              id: "paragraph:1",
              type: "paragraph",
              style: {
                fontSize: "16px",
                lineHeight: "26px",
              },
              children: [{ text: "Your text here" }],
            },
          ],
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

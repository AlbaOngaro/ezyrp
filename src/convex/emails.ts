import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
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

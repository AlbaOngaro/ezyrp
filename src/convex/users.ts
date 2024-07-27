import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { getAuthData, getUserByClerkId } from "./utils";
import { plan } from "./schema";

export const whoami = query({
  handler: async (ctx) => {
    const { clerk_id } = await getAuthData(ctx);
    const user = await getUserByClerkId(ctx, {
      clerk_id,
    });
    return user;
  },
});

export const get = internalQuery({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, { clerk_id }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerk_id))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  },
});

export const upsert = internalMutation({
  args: {
    plan,
    clerk_id: v.string(),
    workspace: v.string(),
    roles: v.array(v.string()),
  },
  handler: async (ctx, { clerk_id, workspace, roles, plan }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerk_id))
      .unique();

    if (!user) {
      return await ctx.db.insert("users", {
        workspace,
        clerk_id,
        roles,
        plan,
      });
    }

    return await ctx.db.patch(user._id, {
      roles: roles || user.roles,
      plan: plan || user.plan,
      workspace: workspace || user.workspace,
    });
  },
});

export const remove = internalMutation({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, { clerk_id }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerk_id))
      .unique();

    if (!user) {
      return;
    }

    return await ctx.db.delete(user._id);
  },
});

export const list = internalQuery({
  args: {
    workspace: v.string(),
  },
  handler: async (ctx, { workspace }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .collect();
  },
});

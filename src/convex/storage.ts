import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const get = query({
  args: {
    id: v.id("_storage"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.storage.getUrl(id);
  },
});

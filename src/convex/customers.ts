import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    id: v.id("customers"),
  },
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const list = query({
  handler: async (ctx) => await ctx.db.query("customers").collect(),
});

export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    code: v.optional(v.string()),
    country: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { name, email, address, city, code, country, photoUrl },
  ) => {
    await ctx.db.insert("customers", {
      name,
      email,
      address,
      city,
      code,
      country,
      photoUrl,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("customers"),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    code: v.optional(v.string()),
    country: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { id, name, email, address, city, code, country, photoUrl },
  ) => {
    await ctx.db.patch(id, {
      name,
      email,
      address,
      city,
      code,
      country,
      photoUrl,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("customers"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

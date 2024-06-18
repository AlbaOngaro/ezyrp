import { v } from "convex/values";
import { GenericMutationCtx } from "convex/server";
import { mutation, query } from "./_generated/server";
import { DataModel } from "./_generated/dataModel";

type UpsertArgs = {
  name: string;
  email: string;
  address?: string;
  city?: string;
  code?: string;
  country?: string;
  photoUrl?: string;
};

export const upsert = async (
  ctx: GenericMutationCtx<DataModel>,
  { email, name, address, city, code, country, photoUrl }: UpsertArgs,
) => {
  const customer = await ctx.db
    .query("customers")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();

  if (!customer) {
    const id = await ctx.db.insert("customers", {
      name,
      email,
      address,
      city,
      code,
      country,
      photoUrl,
    });

    return await ctx.db.get(id);
  }

  await ctx.db.patch(customer._id, {
    name: name || customer.name,
    email: email || customer.email,
    address: address || customer.address,
    city: city || customer.city,
    code: code || customer.code,
    country: country || customer.country,
    photoUrl: photoUrl || customer.photoUrl,
  });

  return await ctx.db.get(customer._id);
};

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

import { ConvexError, v } from "convex/values";
import { GenericMutationCtx } from "convex/server";
import { mutation, query } from "./_generated/server";
import { DataModel } from "./_generated/dataModel";
import { getAuthData } from "./utils";

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
  const { workspace } = await getAuthData(ctx);

  const customer = await ctx.db
    .query("customers")
    .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
    .filter((q) => q.eq(q.field("email"), email))
    .unique();

  if (!customer) {
    const id = await ctx.db.insert("customers", {
      workspace,
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
    workspace,
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
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const customer = await ctx.db
      .query("customers")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();

    if (!customer) {
      throw new ConvexError("Customer not found");
    }

    return customer;
  },
});

export const list = query({
  handler: async (ctx) => {
    const { workspace } = await getAuthData(ctx);

    return await ctx.db
      .query("customers")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .collect();
  },
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
    const { workspace } = await getAuthData(ctx);

    await ctx.db.insert("customers", {
      workspace,
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
    const { workspace } = await getAuthData(ctx);

    const customer = await ctx.db
      .query("customers")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id as string))
      .unique();

    if (!customer) {
      throw new ConvexError("Item not found");
    }

    await ctx.db.patch(id, {
      workspace,
      name: name || customer.name,
      email: email || customer.email,
      address: address || customer.address,
      city: city || customer.city,
      code: code || customer.code,
      country: country || customer.country,
      photoUrl: photoUrl || customer.photoUrl,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("customers"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const customer = await ctx.db
      .query("customers")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id as string))
      .unique();

    if (!customer) {
      throw new ConvexError("Customer not found in this workspace");
    }

    await ctx.db.delete(id);
  },
});

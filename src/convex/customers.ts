import { ConvexError, v } from "convex/values";
import { GenericMutationCtx, paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";

import { internalQuery, mutation, query } from "./_generated/server";
import { DataModel } from "./_generated/dataModel";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
} from "./utils";
import { internal } from "./_generated/api";

type UpsertArgs = {
  name: string;
  email: string;
  address?: string;
  city?: string;
  code?: string;
  country?: string;
  photoUrl?: string;
  birthday?: string;
};

export const upsert = async (
  ctx: GenericMutationCtx<DataModel>,
  { email, name, address, city, code, country, photoUrl, birthday }: UpsertArgs,
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
      birthday,
    });

    const newC = await ctx.db.get(id);

    if (!newC) {
      throw new ConvexError("Failed to create customer");
    }

    return newC;
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
    birthday: birthday || customer.birthday,
  });

  const newC = await ctx.db.get(customer._id);

  if (!newC) {
    throw new ConvexError("Failed to create customer");
  }

  return newC;
};

export const get = query({
  args: {
    id: v.id("customers"),
  },
  handler: async (ctx, { id }) => {
    return await getEntityByIdInWorkspace(ctx, {
      id,
      table: "customers",
    });
  },
});

export const listInternal = internalQuery({
  args: {
    workspace: v.string(),
  },
  handler: async (ctx, { workspace }) => {
    return await ctx.db
      .query("customers")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .collect();
  },
});

export const list = query({
  handler: async (ctx) => {
    return await getEntitiesInWorkspace(ctx, "customers");
  },
});

export const search = query({
  args: {
    query: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { query = "", paginationOpts }) => {
    const { workspace } = await getAuthData(ctx);

    return await filter(
      ctx.db
        .query("customers")
        .withIndex("by_workspace", (q) => q.eq("workspace", workspace)),
      (customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase()),
    ).paginate(paginationOpts);
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
    birthday: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { name, email, address, city, code, country, photoUrl, birthday },
  ) => {
    const { workspace } = await getAuthData(ctx);

    const id = await ctx.db.insert("customers", {
      workspace,
      name,
      email,
      address,
      city,
      code,
      country,
      photoUrl,
      birthday,
    });

    await ctx.scheduler.runAfter(0, internal.workflows.trigger, {
      args: {
        event: "customer:created",
        workspace,
        entityId: id,
      },
    });

    return id;
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
    birthday: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { id, name, email, address, city, code, country, photoUrl, birthday },
  ) => {
    const customer = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "customers",
    });

    await ctx.db.patch(id, {
      name: name || customer.name,
      email: email || customer.email,
      address: address || customer.address,
      city: city || customer.city,
      code: code || customer.code,
      country: country || customer.country,
      photoUrl: photoUrl || customer.photoUrl,
      birthday: birthday || customer.birthday,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("customers"),
  },
  handler: async (ctx, { id }) => {
    await getEntityByIdInWorkspace(ctx, {
      id,
      table: "customers",
    });

    await ctx.db.delete(id);

    const invoices = await getEntitiesInWorkspace(ctx, "invoices");

    for (const invoice of invoices) {
      await ctx.db.delete(invoice._id);
    }
  },
});

import { v } from "convex/values";
import { GenericMutationCtx } from "convex/server";
import { mutation, query } from "./_generated/server";
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
    birthday: birthday || customer.birthday,
  });

  return await ctx.db.get(customer._id);
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

export const list = query({
  handler: async (ctx) => {
    return await getEntitiesInWorkspace(ctx, "customers");
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
        entityId: id,
      },
    });

    await ctx.scheduler.runAfter(0, internal.workflows.trigger, {
      args: {
        event: "customer:birthday",
        entityId: id,
      },
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

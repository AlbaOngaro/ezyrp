import { v } from "convex/values";
import { GenericMutationCtx } from "convex/server";
import { mutation, query } from "./_generated/server";
import { DataModel } from "./_generated/dataModel";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
  getWorkflowForEvent,
} from "./utils";
import { api } from "./_generated/api";

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

    const customer_created_workflow = await getWorkflowForEvent(
      ctx,
      "customer:created",
    );
    if (customer_created_workflow) {
      const settings = customer_created_workflow.settings;
      if (customer_created_workflow.status !== "active" || !settings) {
        return;
      }

      switch (settings.action) {
        case "email": {
          const template = settings.template;
          const { email } = await getEntityByIdInWorkspace(ctx, {
            id,
            table: "customers",
          });

          if (template && email) {
            await ctx.scheduler.runAfter(0, api.actions.email, {
              template,
              to: email,
            });
          }
          break;
        }
        case "sms": {
          await ctx.scheduler.runAfter(0, api.actions.sms, {
            to: "+1234567890",
            message: "Invoice created",
          });
          break;
        }
        default:
          break;
      }
    }

    const customer_birthday_workflow = await getWorkflowForEvent(
      ctx,
      "customer:birthday",
    );
    if (customer_birthday_workflow) {
      const settings = customer_birthday_workflow.settings;
      if (
        customer_birthday_workflow.status !== "active" ||
        !settings ||
        !birthday
      ) {
        return;
      }

      switch (settings.action) {
        case "email": {
          const template = settings.template;
          const { email } = await getEntityByIdInWorkspace(ctx, {
            id,
            table: "customers",
          });

          if (template && email) {
            await ctx.scheduler.runAt(new Date(birthday), api.actions.email, {
              template,
              to: email,
            });
          }
          break;
        }
        case "sms": {
          await ctx.scheduler.runAfter(0, api.actions.sms, {
            to: "+1234567890",
            message: "Invoice created",
          });
          break;
        }
        default:
          break;
      }
    }
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

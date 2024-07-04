import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
  getWorkflowForEvent,
} from "./utils";
import { api } from "./_generated/api";

export const get = query({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, { id }) => {
    return await getEntityByIdInWorkspace(ctx, {
      id,
      table: "events",
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await getEntitiesInWorkspace(ctx, "events");
  },
});

export const create = mutation({
  args: {
    end: v.string(),
    start: v.string(),
    title: v.string(),
    notes: v.optional(v.string()),
    variant: v.string(),
    guests: v.array(v.id("customers")),
  },
  handler: async (ctx, { end, start, title, notes, variant, guests }) => {
    const { workspace } = await getAuthData(ctx);

    const id = await ctx.db.insert("events", {
      workspace,
      end,
      start,
      title,
      notes,
      variant,
      guests,
    });

    const workflow = await getWorkflowForEvent(ctx, "event:upcoming");
    if (workflow) {
      const settings = workflow.settings;
      if (workflow.status !== "active" || !settings) {
        return;
      }

      switch (settings.action) {
        case "email": {
          const template = settings.template;
          const emails = await Promise.all(
            guests.map((guest) =>
              getEntityByIdInWorkspace(ctx, {
                id: guest,
                table: "customers",
              }).then(({ email }) => email),
            ),
          );

          if (template && emails) {
            await Promise.all(
              emails.map((email) =>
                ctx.scheduler.runAt(new Date(start), api.actions.email, {
                  template,
                  to: email,
                }),
              ),
            );
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

    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    end: v.optional(v.string()),
    start: v.optional(v.string()),
    title: v.optional(v.string()),
    notes: v.optional(v.string()),
    variant: v.optional(v.string()),
    guests: v.optional(v.array(v.id("customers"))),
  },
  handler: async (ctx, { id, end, start, title, notes, variant, guests }) => {
    const event = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "events",
    });

    await ctx.db.patch(id, {
      end: end || event.end,
      start: start || event.start,
      title: title || event.title,
      notes: notes || event.notes,
      variant: variant || event.variant,
      guests: guests || event.guests,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, { id }) => {
    await getEntityByIdInWorkspace(ctx, {
      id,
      table: "events",
    });

    await ctx.db.delete(id);
  },
});

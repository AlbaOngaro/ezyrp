import { isSameDay, parseISO } from "date-fns";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
} from "./utils";
import { internal } from "./_generated/api";

export const get = query({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, { id }) => {
    const event = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "events",
    });

    const eventType = await getEntityByIdInWorkspace(ctx, {
      id: event.type,
      table: "eventTypes",
    });

    return {
      ...event,
      ...eventType,
    };
  },
});

export const search = query({
  args: {
    month: v.optional(v.number()),
    day: v.optional(v.string()),
  },
  handler: async (ctx, { month, day }) => {
    if (!month && !day) {
      throw new ConvexError("Either month or day must be provided");
    }

    if (!!day) {
      const events = await getEntitiesInWorkspace(ctx, "events");
      return events.filter((event) => {
        console.log(parseISO(event.start), parseISO(day));
        return isSameDay(parseISO(event.start), parseISO(day));
      });
    }

    return [];
  },
});

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("approved"), v.literal("unapproved"))),
  },
  handler: async (ctx, { status }) => {
    console.log("status", status);

    const events = await getEntitiesInWorkspace(ctx, "events");

    return Promise.all(
      events
        .filter((event) => !status || event.status === status)
        .map((event) =>
          getEntityByIdInWorkspace(ctx, {
            id: event.type,
            table: "eventTypes",
          }).then(({ _id, _creationTime, ...eventType }) => ({
            ...event,
            ...eventType,
          })),
        ),
    );
  },
});

export const create = mutation({
  args: {
    end: v.string(),
    start: v.string(),
    notes: v.optional(v.string()),
    guests: v.array(v.id("customers")),
    organizer: v.string(),
    type: v.id("eventTypes"),
    status: v.union(v.literal("approved"), v.literal("unapproved")),
  },
  handler: async (
    ctx,
    { end, start, notes, type, guests, organizer, status },
  ) => {
    const { workspace } = await getAuthData(ctx);

    const id = await ctx.db.insert("events", {
      workspace,
      end,
      start,
      notes,
      guests,
      type,
      organizer,
      status,
    });

    await ctx.scheduler.runAfter(0, internal.workflows.trigger, {
      args: {
        event: "event:upcoming",
        workspace,
        entityId: id,
      },
    });

    await ctx.scheduler.runAfter(0, internal.workflows.trigger, {
      args: {
        event: "event:days-passed",
        workspace,
        entityId: id,
      },
    });

    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    end: v.optional(v.string()),
    start: v.optional(v.string()),
    notes: v.optional(v.string()),
    guests: v.optional(v.array(v.id("customers"))),
    status: v.optional(v.union(v.literal("approved"), v.literal("unapproved"))),
  },
  handler: async (ctx, { id, end, start, notes, guests, status }) => {
    const event = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "events",
    });

    await ctx.db.patch(id, {
      end: end || event.end,
      start: start || event.start,
      notes: notes || event.notes,
      guests: guests || event.guests,
      status: status || event.status,
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

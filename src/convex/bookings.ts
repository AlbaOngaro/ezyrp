import { ConvexError, v } from "convex/values";
import { addMinutes } from "date-fns";
import { filter } from "convex-helpers/server/filter";

import { mutation, query } from "./_generated/server";
import { upsert } from "./customers";
import { Id } from "./_generated/dataModel";
import { getEntityByIdInWorkspace } from "./utils";

export const get = query({
  args: {
    id: v.id("eventTypes"),
  },
  handler: async (ctx, { id }) => {
    const eventType = await ctx.db.get(id);
    if (!eventType) {
      throw new ConvexError("Event type not found");
    }

    const events = await filter(ctx.db.query("events"), (e) =>
      e.guests.includes(eventType.user_id),
    ).collect();

    return {
      ...eventType,
      events,
    };
  },
});

export const create = mutation({
  args: {
    type: v.id("eventTypes"),
    start: v.number(),
    guests: v.array(
      v.object({
        name: v.string(),
        email: v.string(),
      }),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const eventtype = await getEntityByIdInWorkspace(ctx, {
      id: args.type,
      table: "eventTypes",
    });

    const guests = await Promise.all(
      args.guests.map((guest) => upsert(ctx, guest)),
    );

    await ctx.db.insert("events", {
      workspace: eventtype.workspace,
      end: addMinutes(new Date(args.start), eventtype.duration).toISOString(),
      start: new Date(args.start).toISOString(),
      guests: guests
        .map((guest) => guest?._id)
        .filter((guest) => !!guest) as Id<"customers">[],
      notes: args.notes,
      type: args.type,
    });
  },
});

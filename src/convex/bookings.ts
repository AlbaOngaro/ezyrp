import { ConvexError, v } from "convex/values";
import { addMinutes } from "date-fns";
import { mutation, query } from "./_generated/server";
import { upsert } from "./customers";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {
    id: v.id("eventTypes"),
  },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
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
    const guests = await Promise.all(
      args.guests.map((guest) => upsert(ctx, guest)),
    );

    const eventtype = await ctx.db.get(args.type);
    if (!eventtype) {
      throw new ConvexError("Event type not found");
    }

    await ctx.db.insert("events", {
      workspace: eventtype.workspace,
      variant: eventtype.variant,
      end: addMinutes(new Date(args.start), eventtype.duration).toISOString(),
      title: eventtype.name,
      start: new Date(args.start).toISOString(),
      guests: guests
        .map((guest) => guest?._id)
        .filter((guest) => !!guest) as Id<"customers">[],
      notes: args.notes,
    });
  },
});

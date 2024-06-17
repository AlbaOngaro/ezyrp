import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    type: v.id("eventTypes"),
    start: v.string(),
    guests: v.array(
      v.object({
        name: v.string(),
        email: v.string(),
      }),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { type, start, guests, notes }) => {
    const guestIds = await Promise.all(
      guests.map((guest) => ctx.db.insert("customers", guest)),
    );

    const eventtype = await ctx.db.get(type);

    if (!eventtype) {
      throw new ConvexError("Event type not found");
    }

    await ctx.db.insert("events", {
      variant: eventtype.variant,
      end: start + eventtype.duration,
      title: eventtype.name,
      start,
      guests: guestIds,
      notes,
    });
  },
});

export const get = query({
  args: {
    id: v.id("eventTypes"),
  },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

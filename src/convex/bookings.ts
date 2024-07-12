import { ConvexError, v } from "convex/values";
import {
  addMinutes,
  intervalToDuration,
  setHours,
  setMinutes,
  format,
  parseISO,
  isSameDay,
} from "date-fns";
import { filter } from "convex-helpers/server/filter";

import { mutation, query } from "./_generated/server";
import { upsert } from "./customers";
import { getEntityByIdInWorkspace } from "./utils";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {
    id: v.id("eventTypes"),
  },
  handler: async (ctx, { id }) => {
    const eventType = await ctx.db.get(id);
    if (!eventType) {
      throw new ConvexError("Event type not found");
    }

    return eventType;
  },
});

export const slots = query({
  args: {
    id: v.id("eventTypes"),
    day: v.string(),
  },
  handler: async (ctx, { id, day }) => {
    const eventType = await ctx.db.get(id);
    if (!eventType) {
      return [];
    }

    const { user_id, duration } = eventType;

    const settings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("user_id"), user_id))
      .unique();

    const [startHours, startMinutes] = (settings?.start || "09:00")
      .split(":")
      .map((t) => parseInt(t, 10));
    const [endHours, endMinutes] = (settings?.end || "17:00")
      .split(":")
      .map((t) => parseInt(t, 10));

    const date = new Date();

    const start = setHours(setMinutes(date, startMinutes), startHours);
    const end = setHours(setMinutes(date, endMinutes), endHours);

    try {
      const { hours = 0, minutes = 0 } = intervalToDuration({
        start,
        end,
      });

      const how_many_events_in_hours = hours * (60 / duration);
      const how_many_events_in_minutes = Math.floor(minutes / duration);

      const slots = Array.from({
        length: how_many_events_in_hours + how_many_events_in_minutes,
      }).map((_, i) => format(addMinutes(start, i * duration), "HH:mm"));

      const events = await filter(ctx.db.query("events"), (e) => {
        const dayDate = parseISO(day);
        const eventDate = parseISO(e.start);

        return (
          isSameDay(eventDate, dayDate) &&
          e.status === "approved" &&
          e.type === id &&
          e.organizer === user_id
        );
      }).collect();

      const booked_slots = events.map((e) => {
        const result = /T(\d{2}:\d{2})/.exec(e.start);
        return result ? result[1] : "";
      });

      return slots.filter((slot) => !booked_slots.includes(slot));
    } catch (e) {
      console.error(e);
      return [];
    }
  },
});

export const create = mutation({
  args: {
    type: v.id("eventTypes"),
    start: v.string(),
    end: v.string(),
    guests: v.array(
      v.object({
        name: v.string(),
        email: v.string(),
      }),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { type, start, end, notes, ...args }) => {
    const eventtype = await getEntityByIdInWorkspace(ctx, {
      id: type,
      table: "eventTypes",
    });

    const guests = await Promise.all(
      args.guests.map((guest) => upsert(ctx, guest)),
    );

    const eid = await ctx.db.insert("events", {
      status: "unapproved",
      organizer: eventtype.user_id,
      workspace: eventtype.workspace,
      end,
      start,
      guests: guests
        .map((guest) => guest?._id)
        .filter((guest) => !!guest) as Id<"customers">[],
      notes,
      type,
    });

    await ctx.db.insert("notifications", {
      title: "New booking request",
      body: `New booking request for ${eventtype.name}`,
      workspace: eventtype.workspace,
      read: false,
      url: `/schedule?${new URLSearchParams({ eid }).toString()}`,
    });
  },
});

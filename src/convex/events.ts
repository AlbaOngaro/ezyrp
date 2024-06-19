import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthData } from "./utils";

export const get = query({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);

    const event = await ctx.db
      .query("events")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();

    if (!event) {
      throw new ConvexError("Event not found");
    }

    return event;
  },
});

export const list = query({
  handler: async (ctx) => {
    const { workspace } = await getAuthData(ctx);

    return await ctx.db
      .query("events")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .collect();
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
    const { workspace } = await getAuthData(ctx);

    const event = await ctx.db
      .query("events")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id as string))
      .unique();

    if (!event) {
      throw new ConvexError("Item not found");
    }

    await ctx.db.patch(id, {
      workspace,
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
    const { workspace } = await getAuthData(ctx);

    const event = await ctx.db
      .query("events")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => q.eq(q.field("_id"), id as string))
      .unique();

    if (!event) {
      throw new ConvexError("Event not found in this workspace");
    }

    await ctx.db.delete(id);
  },
});

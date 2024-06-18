import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  settings: defineTable({
    user_id: v.id("users"),
    start: v.number(),
    end: v.number(),
    days: v.array(v.number()),
  }).index("by_user", ["user_id"]),
  invites: defineTable({
    email: v.string(),
    sent_at: v.optional(v.string()),
  }),
  customers: defineTable({
    email: v.string(),
    name: v.string(),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    code: v.optional(v.string()),
    country: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
  }).index("by_email", ["email"]),
  items: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    quantity: v.number(),
    onetime: v.boolean(),
  }),
  invoices: defineTable({
    customer: v.id("customers"),
    description: v.string(),
    status: v.string(),
    items: v.array(v.id("items")),
    amount: v.number(),
    due: v.string(),
    emitted: v.string(),
  }),
  eventTypes: defineTable({
    name: v.string(),
    variant: v.string(),
    description: v.optional(v.string()),
    duration: v.number(),
  }),
  events: defineTable({
    end: v.string(),
    start: v.string(),
    title: v.string(),
    notes: v.optional(v.string()),
    variant: v.string(),
    guests: v.array(v.id("customers")),
  }),
});

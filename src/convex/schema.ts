import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const email = v.literal("email");
const sms = v.literal("sms");

export const action = v.union(email, sms);

export const defaultEvents = v.union(
  v.literal("customer:created"),
  v.literal("customer:birthday"),
  v.literal("invoice:created"),
  v.literal("invoice:paid"),
  v.literal("invoice:overdue"),
);

export const delayableEvents = v.union(
  v.literal("event:upcoming"),
  v.literal("event:days-passed"),
);

export const settings = v.union(
  v.union(
    v.object({
      action: email,
      event: defaultEvents,
      template: v.id("emails"),
    }),
    v.object({
      action: email,
      event: delayableEvents,
      delay: v.number(),
      template: v.id("emails"),
    }),
  ),
  v.union(
    v.object({
      action: sms,
      event: defaultEvents,
    }),
    v.object({
      action: sms,
      event: delayableEvents,
      delay: v.number(),
    }),
  ),
);

export default defineSchema({
  settings: defineTable({
    user_id: v.string(),
    start: v.number(),
    end: v.number(),
    days: v.array(v.number()),
  }).index("by_user", ["user_id"]),
  customers: defineTable({
    workspace: v.string(),
    email: v.string(),
    name: v.string(),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    code: v.optional(v.string()),
    country: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    birthday: v.optional(v.string()),
  }).index("by_workspace", ["workspace"]),
  items: defineTable({
    workspace: v.string(),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    quantity: v.number(),
    onetime: v.boolean(),
  }).index("by_workspace", ["workspace"]),
  invoices: defineTable({
    workspace: v.string(),
    customer: v.id("customers"),
    description: v.string(),
    status: v.union(v.literal("due"), v.literal("paid"), v.literal("overdue")),
    items: v.array(v.id("items")),
    amount: v.number(),
    due: v.string(),
    emitted: v.string(),
  }).index("by_workspace", ["workspace"]),
  eventTypes: defineTable({
    workspace: v.string(),
    name: v.string(),
    variant: v.string(),
    description: v.optional(v.string()),
    duration: v.number(),
  }).index("by_workspace", ["workspace"]),
  events: defineTable({
    workspace: v.string(),
    end: v.string(),
    start: v.string(),
    title: v.string(),
    notes: v.optional(v.string()),
    variant: v.string(),
    guests: v.array(v.id("customers")),
  }).index("by_workspace", ["workspace"]),
  emails: defineTable({
    body: v.any(),
    workspace: v.string(),
    title: v.optional(v.string()),
    html: v.optional(v.id("_storage")),
  }).index("by_workspace", ["workspace"]),
  workflows: defineTable({
    title: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    settings: v.optional(settings),
    workspace: v.string(),
    // Used in FE to render the graph
    nodes: v.array(v.any()),
    edges: v.array(v.any()),
  }).index("by_workspace", ["workspace"]),
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const email = v.literal("email");
const sms = v.literal("sms");

export const action = v.union(email, sms);

export const recurringCustomerEvents = v.literal("customer:birthday");

export const customerEvents = v.union(
  v.literal("customer:created"),
  recurringCustomerEvents,
);

export const invoiceEvents = v.union(
  v.literal("invoice:created"),
  v.literal("invoice:paid"),
  v.literal("invoice:overdue"),
);

export const eventEvents = v.union(
  v.literal("event:upcoming"),
  v.literal("event:days-passed"),
);

export const settings = v.union(
  v.union(
    v.object({
      action: email,
      event: customerEvents,
      template: v.id("emails"),
    }),
    v.object({
      action: email,
      event: invoiceEvents,
      template: v.id("emails"),
    }),
    v.object({
      action: email,
      event: eventEvents,
      delay: v.number(),
      template: v.id("emails"),
    }),
  ),
  v.union(
    v.object({
      action: sms,
      event: customerEvents,
    }),
    v.object({
      action: sms,
      event: invoiceEvents,
    }),
    v.object({
      action: sms,
      event: eventEvents,
      delay: v.number(),
    }),
  ),
);

export const variant = v.union(
  v.literal("red"),
  v.literal("orange"),
  v.literal("yellow"),
  v.literal("lime"),
  v.literal("green"),
  v.literal("emerald"),
  v.literal("teal"),
  v.literal("cyan"),
  v.literal("sky"),
  v.literal("blue"),
  v.literal("indigo"),
  v.literal("violet"),
  v.literal("purple"),
  v.literal("fuchsia"),
  v.literal("pink"),
  v.literal("rose"),
);

export const range = v.object({ start: v.string(), end: v.string() });

export const plan = v.union(v.literal("free"), v.literal("pro"));

export const interval = v.object({
  start: v.string(),
  end: v.string(),
});

export const day = v.array(interval);

export const days = v.object({
  monday: v.optional(day),
  tuesday: v.optional(day),
  wednesday: v.optional(day),
  thursday: v.optional(day),
  friday: v.optional(day),
  saturday: v.optional(day),
  sunday: v.optional(day),
});

export default defineSchema({
  settings: defineTable({
    days,
    user_id: v.id("users"),
    vacations: v.optional(v.array(interval)),
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
    variant,
    description: v.optional(v.string()),
    duration: v.number(),
    user_id: v.id("users"),
  }).index("by_workspace", ["workspace"]),
  events: defineTable({
    workspace: v.string(),
    end: v.string(),
    start: v.string(),
    notes: v.optional(v.string()),
    type: v.id("eventTypes"),
    guests: v.array(v.id("customers")),
    organizer: v.string(),
    status: v.union(v.literal("approved"), v.literal("unapproved")),
  }).index("by_workspace", ["workspace"]),
  emails: defineTable({
    body: v.any(),
    title: v.string(),
    workspace: v.string(),
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
  notifications: defineTable({
    workspace: v.string(),
    title: v.string(),
    body: v.optional(v.string()),
    url: v.optional(v.string()),
    read: v.boolean(),
  }).index("by_workspace", ["workspace"]),
  users: defineTable({
    plan,
    clerk_id: v.string(),
    workspace: v.string(),
    roles: v.array(v.string()),
  })
    .index("by_clerk_id", ["clerk_id"])
    .index("by_workspace", ["workspace"]),
});

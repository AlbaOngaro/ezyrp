import { z } from "zod";

import { customer } from "./customer";

import { item } from "server/schema/inventory";

export const invoice = z.object({
  id: z.string(),
  customer: customer.omit({ lastInvoice: true }),

  description: z.string(),
  status: z.enum(["paid", "pending", "overdue"]).default("pending"),

  items: z.array(item).default([]),
  amount: z.number().default(0),

  due: z.string().datetime().default(new Date().toISOString()),
  emitted: z.string().datetime().default(new Date().toISOString()),

  created_at: z.string().datetime().default(new Date().toISOString()),
  updated_at: z.string().datetime().default(new Date().toISOString()),
});

export const inputCreateInvoiceArgs = z.object({
  customer: z.string(),
  description: z.string(),
  status: z.enum(["paid", "pending", "overdue"]).default("pending"),
  items: z.array(z.string()),
  due: z.string().datetime().default(new Date().toISOString()),
  emitted: z.string().datetime().default(new Date().toISOString()),
});

export const inputInvoiceFilters = z.object({
  start: z.number().default(0),
  limit: z.number().default(10),
});

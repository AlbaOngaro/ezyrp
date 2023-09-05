import { z } from "zod";

import { customer } from "./customer";

const item = z.object({
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
});

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

export const inputInvoiceFilters = z.object({
  start: z.number().default(0),
  limit: z.number().default(10),
});

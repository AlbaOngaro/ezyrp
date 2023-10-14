import { z } from "zod";

import { formatISO } from "date-fns";
import { customer } from "./customer";

import { item } from "./inventory";

export const invoice = z.object({
  id: z.string(),
  customer: customer.omit({ lastInvoice: true }),

  description: z.string(),
  status: z.enum(["paid", "pending", "overdue"]).default("pending"),

  items: z.array(item).default([]),
  amount: z.number().default(0),

  due: z.string().datetime().default(formatISO(new Date())),
  emitted: z.string().datetime().default(formatISO(new Date())),

  created_at: z.string().datetime().default(formatISO(new Date())),
  updated_at: z.string().datetime().default(formatISO(new Date())),
});

export const inputCreateInvoiceArgs = z.object({
  customer: z.string(),
  description: z.string(),
  status: z.enum(["paid", "pending", "overdue"]).default("pending"),
  items: z.array(z.string()),
  due: z.string().datetime().default(formatISO(new Date())),
  emitted: z.string().datetime().default(formatISO(new Date())),
});

export const inputInvoiceFilters = z.object({
  start: z.number().default(0),
  limit: z.number().default(10),
});

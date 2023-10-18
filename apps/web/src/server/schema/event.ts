import { z } from "zod";
import { customer } from "./customer";

export const variants: readonly [string, ...string[]] = [
  "red",
  "orange",
  "orange",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

export const event = z.object({
  id: z.string(),
  end: z.string(),
  start: z.string(),
  title: z.string(),
  notes: z.string().optional().nullable(),
  variant: z.string(),
  guests: z.array(customer.omit({ lastInvoice: true })).default([]),
});

export const createEventInput = z.object({
  type: z.string(),
  start: z.string(),
  guests: z.array(z.string()),
});

export const updateEventInput = z.object({
  id: z.string(),
  type: z.string().optional(),
  start: z.string().optional(),
  guests: z.array(z.string()).optional(),
});

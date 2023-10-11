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
  start: z.string().datetime(),
  end: z.string().datetime(),
  title: z.string(),
  variant: z.enum(variants).default("blue"),
  guests: z.array(customer.omit({ lastInvoice: true })).default([]),
});

export const createEventInput = z.object({
  id: z.string(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  title: z.string(),
  variant: z.enum(variants).default("blue"),
  guests: z.array(z.string()),
});

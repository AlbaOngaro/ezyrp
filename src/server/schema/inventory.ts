import { z } from "zod";

export const item = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(""),
  price: z.number(),
  quantity: z.number(),
  onetime: z.boolean().nullable().default(false),
});

export const inputItemFilters = z.object({
  start: z.number().default(0),
  limit: z.number().default(10),
});

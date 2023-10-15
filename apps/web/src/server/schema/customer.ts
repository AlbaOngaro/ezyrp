import { z } from "zod";

export const customer = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  code: z.string().optional(),
  country: z.string().optional(),
  photoUrl: z.string().optional().default(""),
  lastInvoice: z
    .object({
      emitted: z.string().datetime(),
      amount: z.number(),
      status: z.enum(["paid", "pending", "overdue"]),
    })
    .optional()
    .nullable(),
});

export const inputCustomerFilters = z
  .object({
    start: z.number().default(0),
    limit: z.number().default(10),
    email: z.string(),
    name: z.string(),
    phone: z.string(),
  })
  .partial({
    email: true,
    name: true,
    phone: true,
  });

export const inputCustomersOrderBy = z
  .object({
    lastInvoice: z.string(),
  })
  .partial();

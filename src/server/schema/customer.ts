import { z } from "zod";

export const customer = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string(),
  photoUrl: z.string().default(""),
  lastInvoice: z
    .object({
      emitted: z.string().datetime(),
      amount: z.number(),
      status: z.enum(["paid", "pending", "overdue"]),
    })
    .nullable(),
});

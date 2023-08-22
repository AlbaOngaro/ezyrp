import { z } from "zod";

import { customer } from "./customer";

export const invoice = z.object({
  id: z.string(),
  workspace: z.string(),
  customer: customer.omit({ workspace: true }),

  description: z.string(),
  amount: z.number().default(0),
  status: z.enum(["paid", "pending", "overdue"]).default("pending"),
});

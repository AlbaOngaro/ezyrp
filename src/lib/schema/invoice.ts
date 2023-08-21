import { z } from "zod";

import { customer } from "./customer";

export const invoice = z.object({
  id: z.string(),
  customer: customer.omit({ workspace: true }),
  description: z.string(),
  status: z.enum(["paid", "pending", "overdue"]),
  workspace: z.string(),
});

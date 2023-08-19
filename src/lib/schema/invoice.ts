import { z } from "zod";

import { customer } from "./customer";

export const invoice = z.object({
  id: z.string(),
  customer,
  description: z.string(),
});

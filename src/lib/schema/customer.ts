import { z } from "zod";

export const customer = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.number(),
});

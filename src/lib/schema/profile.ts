import { z } from "zod";

export const profile = z.object({
  id: z.string(),
  user: z.string(),
  address: z.string(),
  city: z.string(),
  code: z.string(),
  country: z.string(),
});

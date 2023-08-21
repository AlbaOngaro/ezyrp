import { z } from "zod";

export const profile = z.object({
  // identifiers
  id: z.string(),
  user: z.string(),

  // location
  address: z.string(),
  city: z.string(),
  code: z.string(),
  country: z.string(),

  // user details
  name: z.string(),
});

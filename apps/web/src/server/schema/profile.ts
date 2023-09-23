import { z } from "zod";

export const profile = z.object({
  id: z.string(),
  // identifiers
  user: z.string(),

  // location
  address: z.string().default(""),
  city: z.string().default(""),
  code: z.string().default(""),
  country: z.string().default(""),

  // user details
  name: z.string().default(""),

  photoUrl: z.string().nullable().default(""),
});

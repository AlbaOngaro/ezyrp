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

export const inputUpdateProfile = z
  .object({
    photoUrl: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
  })
  .refine((args) => !args.photoUrl || (args.photoUrl && args.name), {
    message: "Passwords don't match",
    path: ["name"], // path of error
  });

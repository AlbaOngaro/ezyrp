import { z } from "zod";

export const schema = [
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),

  z.object({
    photoUrl: z.string().optional(),
    name: z.string().min(1),
    address: z.string().optional(),
    city: z.string().optional(),
    code: z.string().optional(),
    country: z.string().optional(),
  }),

  z.object({
    email: z.string().email(),
    password: z.string().min(8),

    photoUrl: z.string().optional(),
    name: z.string().min(1),
    address: z.string().optional(),
    city: z.string().optional(),
    code: z.string().optional(),
    country: z.string().optional(),

    start: z.number(),
    end: z.number(),
    days: z.array(z.number()),
  }),
];

export const formData = z.object({
  email: z.string().email(),
  password: z.string().min(8),

  photoUrl: z.string().optional(),
  name: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  code: z.string().optional(),
  country: z.string().optional(),

  start: z.number(),
  end: z.number(),
  days: z.array(z.number()),
});

import { z } from "zod";

export const user = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
});

export const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().nullable(),
});

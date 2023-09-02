import { z } from "zod";
import { profile } from "server/schema/profile";

export const user = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
  profile,
});

export const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string(),
  workspace: z.string().nullable(),
});

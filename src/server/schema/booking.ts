import { z } from "zod";

export const bookEventInput = z.object({
  type: z.string(),
  start: z.string(),
  guests: z.array(
    z.object({
      name: z.string(),
      email: z.string().email(),
    }),
  ),
  notes: z.string().optional(),
});

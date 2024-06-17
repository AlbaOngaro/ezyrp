import { z } from "zod";

export const inputUpdateSettings = z.object({
  start: z.number(),
  end: z.number(),
  days: z.array(z.number()),
});

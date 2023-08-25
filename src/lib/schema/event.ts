import { z } from "zod";

export const event = z.object({
  id: z.string(),
  workspace: z.string(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  title: z.string(),
});

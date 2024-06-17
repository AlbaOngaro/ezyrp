import { z } from "zod";
import { variants } from "./constants";
import { formData } from "./schema";

export type RegisterContextValue = {
  next: () => void;
  prev: () => void;
};

export type Variant = keyof typeof variants;

export type FormData = z.infer<typeof formData>;

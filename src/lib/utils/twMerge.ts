import { twMerge as twMegeOriginal } from "tailwind-merge";
import clsx, { ClassValue } from "clsx";

export function twMerge(...args: ClassValue[]) {
  return twMegeOriginal(clsx(...args));
}

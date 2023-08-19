import { twMerge } from "lib/utils/twMerge";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
}: Props) {
  return (
    <button
      className={twMerge(
        "rounded font-semibold shadow-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        {
          "px-2 py-1 text-xs": size === "xs",
          "px-2 py-1 text-sm": size === "sm",
          "px-2.5 py-1.5 text-sm": size === "md",
          "px-3 py-2 text-sm": size === "lg",
          "px-3.5 py-2.5 text-sm ": size === "xl",
          "text-white bg-indigo-600  hover:bg-indigo-500 focus-visible:outline-indigo-600":
            variant === "primary",
          "text-indigo-600 bg-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-600 hover:text-white":
            variant === "secondary",
          "text-white bg-red-500 hover:bg-red-400 focus-visible:ring-red-300":
            variant === "danger",
        },
        className,
      )}
    >
      {children}
    </button>
  );
}

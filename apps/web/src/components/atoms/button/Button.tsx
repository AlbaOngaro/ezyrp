import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "../../../lib/utils/twMerge";

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "default" | "circle";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "primary",
    size = "md",
    shape = "default",
    children,
    className,
    loading,
    disabled,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={twMerge(
        "rounded font-semibold shadow-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
        {
          "px-2 py-1 text-xs": size === "xs",
          "px-2 py-1 text-sm": size === "sm",
          "px-2.5 py-1.5 text-sm": size === "md",
          "px-3 py-2 text-sm": size === "lg",
          "px-3.5 py-2.5 text-sm ": size === "xl",

          "text-white bg-orange-500  hover:bg-orange-400 focus-visible:outline-orange-500":
            variant === "primary",
          "text-orange-500 bg-white ring-1 ring-inset ring-orange-500 hover:bg-orange-500 hover:text-white":
            variant === "secondary",
          "text-white bg-red-500 hover:bg-red-400 focus-visible:ring-red-300":
            variant === "danger",
          "text-gray-900 bg-white ring-1 ring-inset ring-gray-300":
            variant === "tertiary",

          "rounded-full text-[0]": shape === "circle",
          "w-4 h-4": shape === "circle" && size === "xs",
          "w-6 h-6": shape === "circle" && size === "sm",
          "w-8 h-8": shape === "circle" && size === "md",
          "w-10 h-10": shape === "circle" && size === "lg",
          "w-12 h-12": shape === "circle" && size === "xl",

          "flex flex-row items-center gap-2": loading,
        },
        className,
      )}
      disabled={loading || disabled}
      {...props}
    >
      {children}{" "}
      {loading && (
        <img className="w-4 h-4" src="/images/loader.svg" alt="loader" />
      )}
    </button>
  );
});

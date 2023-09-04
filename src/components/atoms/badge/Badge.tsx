import { DetailedHTMLProps, HTMLAttributes } from "react";
import { twMerge } from "lib/utils/twMerge";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  variant: "info" | "success" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Badge({
  variant,
  className,
  children,
  size = "lg",
  ...rest
}: Props) {
  return (
    <span
      className={twMerge(
        "inline-flex flex-row items-center gap-2 rounded-md text-xs font-bold capitalize",
        {
          "text-red-500 bg-red-200": variant === "danger",
          "text-orange-500 bg-orange-200": variant === "info",
          "text-green-500 bg-green-200": variant === "success",

          "py-1.5 px-2": size === "sm",
          "py-2 px-4": size === "md",
          "py-2.5 px-6 text-sm": size === "lg",
        },
        className,
      )}
      {...rest}
    >
      <i
        className={twMerge("block w-2 h-2 rounded-full", {
          "bg-red-500": variant === "danger",
          "bg-orange-500": variant === "info",
          "bg-green-500": variant === "success",
        })}
      />{" "}
      {children}
    </span>
  );
}

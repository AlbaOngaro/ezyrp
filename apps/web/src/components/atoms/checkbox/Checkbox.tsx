import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "../../../lib/utils/twMerge";

export const Checkbox = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(function Checkbox({ className, ...props }, ref) {
  return (
    <input
      type="checkbox"
      className={twMerge(
        "absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded cursor-pointer border-gray-300 text-orange-500 focus:ring-orange-500",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

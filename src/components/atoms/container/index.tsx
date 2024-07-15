import { forwardRef } from "react";
import { cn } from "lib/utils/cn";

interface Props<T extends React.ElementType> {
  as?: T;
  children?: React.ReactNode;
  className?: string;
}

export const Container = forwardRef(function Container<
  T extends React.ElementType = "div",
>({ as, children, className, ...rest }: Props<T>, ref: any) {
  const Component = as || "div";

  return (
    <Component
      ref={ref}
      className={cn("mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8", className)}
      {...rest}
    >
      {children}
    </Component>
  );
});

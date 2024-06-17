import { Ref, forwardRef } from "react";
import { cn } from "lib/utils/cn";

interface Props<T extends React.ElementType> {
  as?: T;
  children?: React.ReactNode;
  className?: string;
}

export const Card = forwardRef(function Card<
  T extends React.ElementType = "article",
>({ as, children, className, ...rest }: Props<T>, ref: Ref<HTMLElement>) {
  const Component = as || "article";

  return (
    <Component
      ref={ref}
      className={cn("bg-white p-4 rounded-md shadow-sm", className)}
      {...rest}
    >
      {children}
    </Component>
  );
});

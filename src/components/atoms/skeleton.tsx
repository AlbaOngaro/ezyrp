import { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "lib/utils/cn";

type Props<E extends ElementType> = {
  as?: E;
} & ComponentPropsWithoutRef<E>;

function Skeleton<E extends ElementType>({
  className,
  as,
  ...props
}: Props<E>) {
  const Component = as || "div";

  return (
    <Component
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };

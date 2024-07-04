import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";

import { cn } from "lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
      size: {
        sm: "px-2.5 py-0.5",
        default: "px-3.5 py-1.5",
        lg: "px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { className, variant, size, ...props },
  ref,
) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  );
});

export { Badge, badgeVariants };

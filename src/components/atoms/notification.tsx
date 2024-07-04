import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "lib/utils/cn";

const notificationVariants = cva(
  "relative inline-flex h-3 w-3 rounded-full bg-blue-600",
  {
    variants: {
      size: {
        sm: "h-2 w-2",
        default: "h-3 w-3",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type Props = VariantProps<typeof notificationVariants>;

export function Notification({ size }: Props) {
  return (
    <span
      className={cn(
        notificationVariants({ size }),
        "absolute top-0 left-0 -ml-1 -mt-1 flex bg-transparent",
      )}
    >
      <span
        className={cn(
          notificationVariants({ size }),
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
        )}
      />
      <span className={notificationVariants({ size })} />
    </span>
  );
}

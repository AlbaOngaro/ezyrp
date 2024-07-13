import { cva, VariantProps } from "class-variance-authority";
import { cn } from "lib/utils/cn";

const eventBadgeVariants = cva("w-4 h-4 rounded-md", {
  variants: {
    variant: {
      red: "bg-red-500",
      orange: "bg-orange-400",
      yellow: "bg-yellow-400",
      lime: "bg-lime-500",
      green: "bg-green-500",
      emerald: "bg-emerald-500",
      teal: "bg-teal-500",
      cyan: "bg-cyan-500",
      sky: "bg-sky-500",
      blue: "bg-blue-500",
      indigo: "bg-indigo-400",
      violet: "bg-violet-500",
      purple: "bg-purple-500",
      fuchsia: "bg-fuchsia-500",
      pink: "bg-pink-500",
      rose: "bg-rose-500",
    },
  },
});

type Props = VariantProps<typeof eventBadgeVariants> & {
  className?: string;
};

export function EventBadge({ variant, className }: Props) {
  return <i className={cn(eventBadgeVariants({ variant }), className)} />;
}

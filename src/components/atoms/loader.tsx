import { LoaderCircle } from "lucide-react";
import { cn } from "lib/utils/cn";

type Props = {
  className?: string;
};

export function Loader({ className }: Props) {
  return <LoaderCircle className={cn("animate-spin", className)} />;
}

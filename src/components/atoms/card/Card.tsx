import { PropsWithChildren } from "react";
import { twMerge } from "lib/utils/twMerge";

interface Props extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className }: Props) {
  return <article className={twMerge("", className)}>{children}</article>;
}

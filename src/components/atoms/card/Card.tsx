import { twMerge } from "lib/utils/twMerge";

interface Props<T extends React.ElementType> {
  as?: T;
  children?: React.ReactNode;
  className?: string;
}

export function Card<T extends React.ElementType = "article">({
  as,
  children,
  className,
}: Props<T>) {
  const Component = as || "article";

  return (
    <Component
      className={twMerge("bg-white p-4 rounded-md shadow-sm", className)}
    >
      {children}
    </Component>
  );
}

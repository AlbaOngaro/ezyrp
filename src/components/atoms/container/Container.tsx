import { twMerge } from "lib/utils/twMerge";

interface Props<T extends React.ElementType> {
  as?: T;
  children?: React.ReactNode;
  className?: string;
}

export function Container<T extends React.ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: Props<T>) {
  const Component = as || "div";

  return (
    <Component
      className={twMerge(
        "mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

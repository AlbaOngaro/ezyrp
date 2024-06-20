import React, { forwardRef } from "react";

type RootProps = React.ComponentPropsWithoutRef<"a">;

export type LinkProps = RootProps;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { target = "_blank", style, ...props },
  ref,
) {
  return (
    <a
      {...props}
      style={{
        color: "#067df7",
        textDecoration: "none",
        ...style,
      }}
      target={target}
      ref={ref}
    >
      {props.children}
    </a>
  );
});

import React, { forwardRef } from "react";

type RootProps = React.ComponentPropsWithoutRef<"p">;

export type TextProps = RootProps;

export const Text = forwardRef<HTMLParagraphElement, TextProps>(function Text(
  { style, ...props },
  ref,
) {
  return (
    <p
      {...props}
      style={{
        fontSize: "14px",
        lineHeight: "24px",
        margin: "16px 0",
        ...style,
      }}
      ref={ref}
    />
  );
});

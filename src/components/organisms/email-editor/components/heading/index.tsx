import { Slot } from "@radix-ui/react-slot";
import React, { forwardRef } from "react";
import type { As, Margin } from "./utils";
import { withMargin } from "./utils";

export type HeadingAs = As<"h1", "h2", "h3", "h4", "h5", "h6">;
export type HeadingProps = HeadingAs & Margin;

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    { as: Tag = "h1", children, style, m, mx, my, mt, mr, mb, ml, ...props },
    ref,
  ) {
    return (
      <Slot
        {...props}
        style={{ ...withMargin({ m, mx, my, mt, mr, mb, ml }), ...style }}
      >
        <Tag ref={ref}>{children}</Tag>
      </Slot>
    );
  },
);

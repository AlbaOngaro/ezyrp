import { Slot } from "@radix-ui/react-slot";
import React, { forwardRef } from "react";
import { RenderElementProps } from "slate-react";
import { withActionHandlers } from "../../hocs/withActionHandlers";
import { withToolbar } from "../../hocs/withToolbar";
import type { As, Margin } from "./utils";
import { renderToolbar } from "./toolbar";
import { HeadingElement } from "types/slate";

export type HeadingAs = As<"h1", "h2", "h3", "h4", "h5", "h6">;
export type HeadingProps = HeadingAs & Margin;

interface Props extends RenderElementProps {
  element: HeadingElement;
}

const Heading = forwardRef<HTMLHeadingElement, Props>(function Heading(
  { element, attributes, children },
  ref,
) {
  const { as: Tag = "h1", style } = element;

  return (
    <Slot {...attributes} style={style}>
      <Tag ref={ref}>{children}</Tag>
    </Slot>
  );
});

const EnhancedHeading = withToolbar(withActionHandlers(Heading), {
  renderToolbar,
});

export { EnhancedHeading as Heading };

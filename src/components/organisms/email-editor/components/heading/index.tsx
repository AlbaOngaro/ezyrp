import { Slot } from "@radix-ui/react-slot";
import React, { forwardRef } from "react";
import { RenderElementProps } from "slate-react";
import { withActionHandlers } from "../../hocs/withActionHandlers";
import { withToolbar } from "../../hocs/withToolbar";
import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import type { As, Margin } from "./utils";
import { renderToolbar } from "./toolbar";
import { HeadingElement } from "types/slate";
import { cn } from "lib/utils/cn";

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
  const isSelected = useGetIsSelected(element);

  return (
    <Slot {...attributes} style={style}>
      <Tag
        ref={ref}
        className={cn("py-4", {
          "outline outline-offset-2 outline-blue-500 outline-2 rounded-[1px]":
            isSelected,
        })}
      >
        {children}
      </Tag>
    </Slot>
  );
});

const EnhancedHeading = withToolbar(withActionHandlers(Heading), {
  renderToolbar,
});

export { EnhancedHeading as Heading };

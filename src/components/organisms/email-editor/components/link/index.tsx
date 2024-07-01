import React, { forwardRef } from "react";
import { RenderElementProps } from "slate-react";
import { mergeRefs } from "lib/utils/mergeRefs";
import { LinkElement } from "types/slate";

interface Props extends RenderElementProps {
  element: LinkElement;
}

export const Link = forwardRef<HTMLAnchorElement, Props>(function Link(
  {
    element: { style, href, target = "_blank" },
    attributes: { ref: slateRef, ...slateAttributes },
    children,
  },
  ref,
) {
  return (
    <a
      style={{
        color: "#067df7",
        textDecoration: "none",
        ...style,
      }}
      target={target}
      href={href}
      ref={mergeRefs(ref, slateRef)}
      {...slateAttributes}
    >
      {children}
    </a>
  );
});

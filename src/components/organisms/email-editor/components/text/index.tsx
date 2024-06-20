import React, { forwardRef } from "react";
import { RenderElementProps } from "slate-react";
import { useDraggable } from "@dnd-kit/core";

import { mergeRefs } from "lib/utils/mergeRefs";
import { ParagraphElement } from "types/slate";

interface Props extends RenderElementProps {
  element: ParagraphElement;
}

export const Text = forwardRef<HTMLParagraphElement, Props>(function Text(
  {
    attributes: { ref: slateRef, ...slateAttributes },
    element: { style, id },
    children,
  },
  ref,
) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  return (
    <p
      style={{
        fontSize: "14px",
        lineHeight: "24px",
        margin: "16px 0",
        ...(style || {}),
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : "unset",
      }}
      ref={mergeRefs(ref, slateRef, setNodeRef)}
      {...slateAttributes}
      {...attributes}
      {...listeners}
    >
      {children}
    </p>
  );
});

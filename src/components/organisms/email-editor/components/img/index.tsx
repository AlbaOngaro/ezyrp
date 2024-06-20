import React, { forwardRef } from "react";
import { RenderElementProps } from "slate-react";
import { useDraggable } from "@dnd-kit/core";

import { mergeRefs } from "lib/utils/mergeRefs";
import { ImgElement } from "types/slate";

interface Props extends RenderElementProps {
  element: ImgElement;
}

export const Img = forwardRef<HTMLImageElement, Props>(function Img(
  {
    attributes: { ref: slateRef, ...slateAttributes },
    element: { id, src, alt, style },
    children,
  },
  ref,
) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  return (
    <div
      contentEditable={false}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : "unset",
      }}
      ref={mergeRefs(ref, slateRef, setNodeRef)}
      {...listeners}
      {...attributes}
      {...slateAttributes}
    >
      <img
        alt={alt}
        src={src}
        style={{
          display: "block",
          outline: "none",
          border: "none",
          textDecoration: "none",
          ...(style || {}),
        }}
      />
      {children}
    </div>
  );
});

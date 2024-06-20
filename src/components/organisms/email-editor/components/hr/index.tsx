import React, { forwardRef } from "react";
import { RenderElementProps } from "slate-react";
import { useSortable } from "@dnd-kit/sortable";
import { HrElement } from "types/slate";

import { mergeRefs } from "lib/utils/mergeRefs";

interface Props extends RenderElementProps {
  element: HrElement;
}

export const Hr = forwardRef<HTMLHRElement, Props>(function Hr(
  {
    attributes: { ref: slateRef, ...slateAttributes },
    element: { id, style },
    children,
  },
  ref,
) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
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
      <hr
        style={{
          width: "100%",
          border: "none",
          borderTop: "1px solid #eaeaea",
          ...style,
        }}
      />
      {children}
    </div>
  );
});

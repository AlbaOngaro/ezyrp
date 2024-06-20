import React, { forwardRef } from "react";
import { RenderElementProps } from "slate-react";
import { useDroppable } from "@dnd-kit/core";

import { mergeRefs } from "lib/utils/mergeRefs";
import { ContainerElement } from "types/slate";

interface Props extends RenderElementProps {
  element: ContainerElement;
}

export const Container = forwardRef<HTMLTableElement, Props>(function Container(
  { children, element: { style, id }, attributes },
  ref,
) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <table
      {...attributes}
      align="center"
      width="100%"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{
        maxWidth: "37.5em",
        ...(style || {}),
        color: isOver ? "green" : undefined,
      }}
      ref={mergeRefs(ref, attributes.ref, setNodeRef)}
    >
      <tbody>
        <tr style={{ width: "100%" }}>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  );
});

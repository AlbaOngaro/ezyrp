import React, { forwardRef } from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import { Transforms } from "slate";
import { mergeRefs } from "lib/utils/mergeRefs";
import { ContainerElement } from "types/slate";

interface Props extends RenderElementProps {
  element: ContainerElement;
}

export const Container = forwardRef<HTMLTableElement, Props>(function Container(
  { children, element, attributes },
  ref,
) {
  const { style, children: items } = element;

  const editor = useSlateStatic();

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
      }}
      ref={mergeRefs(ref, attributes.ref)}
    >
      <tbody>
        <tr style={{ width: "100%" }}>
          <td>
            <DndContext
              onDragEnd={({ active, over }) => {
                if (over && active.id !== over.id) {
                  const oldIndex = items.findIndex(
                    (item) => item.id === active.id,
                  );
                  const newIndex = items.findIndex(
                    (item) => item.id === over.id,
                  );

                  const path = ReactEditor.findPath(editor, element);

                  Transforms.moveNodes(editor, {
                    at: [...path, oldIndex],
                    to: [...path, newIndex],
                  });
                }
              }}
            >
              <SortableContext items={items}>{children}</SortableContext>
            </DndContext>
          </td>
        </tr>
      </tbody>
    </table>
  );
});

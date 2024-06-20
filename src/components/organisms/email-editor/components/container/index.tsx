import React, { forwardRef, useCallback } from "react";
import { useSlateStatic } from "slate-react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import { Transforms, Element, Text } from "slate";
import { EditableProps } from "slate-react/dist/components/editable";

export const Container = forwardRef<HTMLTableElement, EditableProps>(
  function Container({ children, style, ...rest }, ref) {
    const editor = useSlateStatic();

    const items = editor.children.filter(
      (child) => !Text.isText(child),
    ) as Element[];

    const onDragEnd = useCallback(
      ({ active, over }: DragEndEvent) => {
        if (over && active.id !== over.id) {
          try {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            Transforms.moveNodes(editor, {
              at: [oldIndex],
              to: [newIndex],
            });
          } catch (err) {
            console.error(err);
          }
        }
      },
      [editor, items],
    );

    return (
      // @ts-ignore
      <table
        align="center"
        width="100%"
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={{
          ...(style || {}),
          maxWidth: "37.5em",
        }}
        ref={ref}
        {...rest}
      >
        <tbody>
          <tr style={{ width: "100%" }}>
            <td>
              <DndContext onDragEnd={onDragEnd}>
                <SortableContext items={items}>{children}</SortableContext>
              </DndContext>
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);

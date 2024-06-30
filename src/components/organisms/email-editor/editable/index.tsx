import React, { forwardRef, useRef } from "react";
import { DndContext, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { EditableProps } from "slate-react/dist/components/editable";
import { useSlateStatic } from "slate-react";
import { Sidebar } from "../sidebar";
import { EditorConfigProvider } from "../providers/config";
import { useOnDragEnd } from "./hooks/useOnDragEnd";
import { useGetSortableItems } from "./hooks/useGetSortableItems";
import { useGetSidebarContainer } from "./hooks/useGetSidebarContainer";
import { collisionDetection } from "./collisionDetection";
import { useClickOutsideRect } from "hooks/useClickOutsideRect";

export const Editable = forwardRef<HTMLTableElement, EditableProps>(
  function Editable({ children, style, ...rest }, ref) {
    const key = useRef(0);
    const editor = useSlateStatic();
    const body = useRef<HTMLTableSectionElement | null>(null);

    useClickOutsideRect(
      body,
      (e) => {
        if (!e.defaultPrevented) {
          editor.deselect();
        }
      },
      {
        tolerance: 40,
      },
    );

    const { setNodeRef } = useDroppable({
      id: "editor",
    });

    const onDragEnd = useOnDragEnd();
    const items = useGetSortableItems();
    const container = useGetSidebarContainer();

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
        <tbody ref={body}>
          <tr style={{ width: "100%" }}>
            <td ref={setNodeRef}>
              <EditorConfigProvider>
                <DndContext
                  onDragEnd={(e) => {
                    key.current = key.current + 1;
                    onDragEnd(e);
                  }}
                  collisionDetection={collisionDetection}
                >
                  <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}
                  >
                    {children}
                    {container ? (
                      <Sidebar key={key.current} container={container} />
                    ) : null}
                  </SortableContext>
                </DndContext>
              </EditorConfigProvider>
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);

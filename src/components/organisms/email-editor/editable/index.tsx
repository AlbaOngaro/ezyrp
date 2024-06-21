import React, { forwardRef } from "react";
import { DndContext, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { EditableProps } from "slate-react/dist/components/editable";
import { Sidebar } from "../sidebar";
import { useOnDragEnd } from "./hooks/useOnDragEnd";
import { useGetItems } from "./hooks/useGetItems";
import { useGetSidebarContainer } from "./hooks/useGetSidebarContainer";
import { useOnDragOver } from "./hooks/useOnDragOver";
import { Loader } from "components/atoms/loader";

export const Editable = forwardRef<HTMLTableElement, EditableProps>(
  function Editable({ children, style, ...rest }, ref) {
    const { setNodeRef } = useDroppable({
      id: "editor",
    });

    const items = useGetItems();
    const onDragEnd = useOnDragEnd();
    const onDragOver = useOnDragOver();
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
        <tbody>
          <tr style={{ width: "100%" }}>
            <td ref={setNodeRef}>
              <DndContext onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <SortableContext
                  items={items}
                  strategy={verticalListSortingStrategy}
                >
                  {children}
                  {container ? <Sidebar container={container} /> : <Loader />}
                </SortableContext>
              </DndContext>
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);

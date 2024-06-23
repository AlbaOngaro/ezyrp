import React, { forwardRef, useRef } from "react";
import {
  DndContext,
  useDroppable,
  useSensors,
  useSensor,
  MouseSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { EditableProps } from "slate-react/dist/components/editable";
import { Sidebar } from "../sidebar";
import { useOnDragEnd } from "./hooks/useOnDragEnd";
import { useGetSortableItems } from "./hooks/useGetSortableItems";
import { useGetSidebarContainer } from "./hooks/useGetSidebarContainer";
import { useOnDragOver } from "./hooks/useOnDragOver";
import { Loader } from "components/atoms/loader";

export const Editable = forwardRef<HTMLTableElement, EditableProps>(
  function Editable({ children, style, ...rest }, ref) {
    const key = useRef(0);

    const { setNodeRef } = useDroppable({
      id: "editor",
    });

    const onDragEnd = useOnDragEnd();
    const onDragOver = useOnDragOver();
    const items = useGetSortableItems();
    const container = useGetSidebarContainer();

    const mouseSensor = useSensor(MouseSensor);
    const keyboardSensor = useSensor(KeyboardSensor);
    const sensors = useSensors(mouseSensor, keyboardSensor);

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
              <DndContext
                onDragEnd={(e) => {
                  key.current = key.current + 1;
                  onDragEnd(e);
                }}
                onDragOver={onDragOver}
                sensors={sensors}
              >
                <SortableContext
                  items={items}
                  strategy={verticalListSortingStrategy}
                >
                  {children}
                  {container ? (
                    <Sidebar key={key.current} container={container} />
                  ) : (
                    <Loader />
                  )}
                </SortableContext>
              </DndContext>
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);

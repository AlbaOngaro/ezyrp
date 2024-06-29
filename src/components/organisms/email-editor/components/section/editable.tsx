import { forwardRef, TextareaHTMLAttributes } from "react";
import { EditableProps } from "slate-react/dist/components/editable";
import { DndContext, useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useGetSortableItems } from "../../editable/hooks/useGetSortableItems";
import { useOnDragEnd } from "../../editable/hooks/useOnDragEnd";
import { mergeRefs } from "lib/utils/mergeRefs";

type Props = Omit<EditableProps, "onChange" | "id"> &
  TextareaHTMLAttributes<HTMLTableDataCellElement> & {
    id: string;
  };

export const Editable = forwardRef<HTMLTableDataCellElement, Props>(
  function Editable({ children, id, ...rest }, ref) {
    const { setNodeRef } = useDroppable({
      id,
    });

    const items = useGetSortableItems();
    const onDragEnd = useOnDragEnd();

    return (
      <td {...rest} ref={mergeRefs(ref, setNodeRef)}>
        <DndContext onDragEnd={onDragEnd}>
          <SortableContext items={items}>{children}</SortableContext>
        </DndContext>
      </td>
    );
  },
);

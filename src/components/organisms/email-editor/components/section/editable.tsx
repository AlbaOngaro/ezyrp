import { forwardRef, TextareaHTMLAttributes } from "react";
import { EditableProps } from "slate-react/dist/components/editable";
import { useDroppable, useDndMonitor } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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

    const onDragEnd = useOnDragEnd();
    const items = useGetSortableItems();

    useDndMonitor({
      onDragEnd,
    });

    return (
      <td {...rest} ref={mergeRefs(ref, setNodeRef)}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </td>
    );
  },
);

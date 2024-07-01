import { useDebouncedCallback } from "use-debounce";
import { DragOverEvent } from "@dnd-kit/core";
import { get } from "lodash";
import { ReactEditor, useSlateStatic } from "slate-react";
import { Transforms, Node } from "slate";

import { useGetSortableItems } from "./useGetSortableItems";
import { CustomElement } from "types/slate";

export function useOnDragOver() {
  const editor = useSlateStatic();
  const items = useGetSortableItems();

  return useDebouncedCallback(({ over, active, collisions }: DragOverEvent) => {
    if (over && !items.some((item) => item.id === active.id)) {
      const collision = (collisions || []).find(
        (collision) => collision.id === over.id,
      );
      if (!collision || !collision.data) {
        return;
      }

      const element = get(
        collision,
        "data.droppableContainer.node.current",
        null,
      );
      if (!element) {
        return;
      }

      const node = ReactEditor.toSlateNode(editor, element);
      if (!node) {
        return;
      }

      const path = ReactEditor.findPath(editor, node);
      if (!path) {
        return;
      }

      if (Node.isNode(active.data.current)) {
        console.log("Insering nodes...");
        Transforms.insertNodes(
          editor,
          {
            ...active.data.current,
            skipUpdate: true,
          } as CustomElement,
          { at: path },
        );
      }
    }
  }, 150);
}

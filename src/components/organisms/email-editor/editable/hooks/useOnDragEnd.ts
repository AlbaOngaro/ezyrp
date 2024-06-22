import { useCallback } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { useSlateStatic } from "slate-react";
import { Transforms, Element } from "slate";
import { validate } from "uuid";
import { useGetItems } from "./useGetItems";

export function useOnDragEnd() {
  const items = useGetItems();
  const editor = useSlateStatic();

  return useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over) {
        Transforms.removeNodes(editor, {
          at: [],
          match: (n) => Element.isElement(n) && !validate(n.id),
        });
        return;
      }

      if (active.id !== over.id) {
        try {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          if (oldIndex < 0 || newIndex < 0) {
            return;
          }

          Transforms.moveNodes(editor, {
            at: [oldIndex],
            to: [newIndex],
          });

          Transforms.setNodes(
            editor,
            { skipUpdate: false },
            { at: [newIndex] },
          );
        } catch (err) {
          console.error(err);
        }
      }
    },
    [editor, items],
  );
}

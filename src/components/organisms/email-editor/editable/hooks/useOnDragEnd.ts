import { useCallback } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { useSlateStatic } from "slate-react";
import { Transforms } from "slate";
import { useGetItems } from "./useGetItems";

export function useOnDragEnd() {
  const items = useGetItems();
  const editor = useSlateStatic();

  return useCallback(
    ({ active, over }: DragEndEvent) => {
      if (over && active.id !== over.id) {
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

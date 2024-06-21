import { Editor, Text, Element } from "slate";
import { ReactEditor } from "slate-react";
import { DragEndEvent } from "@dnd-kit/core";
import { useCallback } from "react";

export function useOnDragEnd(editor: Editor) {
  return useCallback(
    ({ active }: DragEndEvent) => {
      const x = active.rect.current.translated?.left;
      const y = active.rect.current.translated?.top;

      setTimeout(() => {
        try {
          if (!x || !y) {
            return;
          }

          const el = window.document.elementFromPoint(x, y);
          if (!el) {
            return;
          }

          try {
            const node = ReactEditor.toSlateNode(editor, el);
            if (!node) {
              return;
            }

            const path = ReactEditor.findPath(editor, node);
            if (!path) {
              return;
            }

            if (Text.isText(node)) {
              const entry = Editor.above(editor, {
                at: path,
                match: (n) =>
                  !Editor.isEditor(n) &&
                  Element.isElement(n) &&
                  Element.isElementType(n, "paragraph"),
              });
              if (!entry) {
                return;
              }

              console.log([entry[0], [0, ...entry[1]]]);
              return;
            }

            console.log([node, [0, ...path]]);
          } catch (error) {
            console.error(error);
          }
        } catch (error) {
          console.error(error);
        }
      }, 0);
    },
    [editor],
  );
}

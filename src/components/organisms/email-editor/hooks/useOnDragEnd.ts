import {
  Editor,
  Text,
  Element,
  NodeEntry,
  Transforms,
  Path,
  Node,
} from "slate";
import { ReactEditor } from "slate-react";
import { DragEndEvent } from "@dnd-kit/core";

function insertNewElement(editor: Editor, [node, at]: NodeEntry) {
  try {
    Transforms.insertNodes(editor, node, {
      at: Path.next(at),
    });
  } catch (error) {
    console.error(error);
  }
}

export function useOnDragEnd(editor: Editor) {
  return ({ active, over }: DragEndEvent) => {
    if (!over) {
      return;
    }

    const x = active.rect.current.translated?.left;
    const y = active.rect.current.translated?.top;

    setTimeout(() => {
      try {
        if (!x || !y || !Node.isNode(active.data.current)) {
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
              match: (n) => !Editor.isEditor(n) && Element.isElement(n),
            });
            if (!entry) {
              return;
            }

            return insertNewElement(editor, [active.data.current, entry[1]]);
          }

          return insertNewElement(editor, [active.data.current, path]);
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    }, 0);
  };
}

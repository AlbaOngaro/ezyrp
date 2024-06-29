import isHotkey from "is-hotkey";
import { Editor, Transforms } from "slate";
import { KeyboardEvent } from "react";
import { getValidUuid } from "lib/utils/getValidUuid";

export function useOnKeyDown(editor: Editor) {
  return (event: KeyboardEvent) => {
    if (isHotkey("shift+enter")(event)) {
      event.preventDefault();
      Transforms.insertText(editor, "\n");
      return;
    }

    if (isHotkey("enter")(event)) {
      event.preventDefault();
      Transforms.insertNodes(editor, {
        id: getValidUuid(),
        type: "paragraph",
        children: [{ text: "" }],
      });
      return;
    }

    if (isHotkey("mod+b")(event)) {
      event.preventDefault();
      try {
        if (!editor.selection) {
          return;
        }

        const entry = Editor.leaf(editor, editor.selection);
        if (!entry) {
          return;
        }

        const [leaf] = entry;
        if (leaf.bold) {
          Editor.removeMark(editor, "bold");
        } else {
          Editor.addMark(editor, "bold", true);
        }
      } catch (error) {
        console.error(error);
      }

      return;
    }

    if (isHotkey("mod+i")(event)) {
      event.preventDefault();
      try {
        if (!editor.selection) {
          return;
        }

        const entry = Editor.leaf(editor, editor.selection);
        if (!entry) {
          return;
        }

        const [leaf] = entry;
        if (leaf.italic) {
          Editor.removeMark(editor, "italic");
        } else {
          Editor.addMark(editor, "italic", true);
        }
      } catch (error) {
        console.error(error);
      }

      return;
    }
  };
}

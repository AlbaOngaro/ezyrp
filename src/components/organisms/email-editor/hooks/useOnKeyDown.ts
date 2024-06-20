import isHotkey from "is-hotkey";
import { Editor, Transforms } from "slate";
import { KeyboardEvent } from "react";

export function useOnKeyDown(editor: Editor) {
  return (event: KeyboardEvent) => {
    if (isHotkey("mod+enter")(event)) {
      event.preventDefault();
      Transforms.insertText(editor, "\n");
      return;
    }

    if (isHotkey("enter")(event)) {
      event.preventDefault();
      Transforms.insertNodes(editor, {
        id: Math.random().toString(36).substr(2, 9),
        type: "paragraph",
        children: [{ text: "" }],
      });
      return;
    }
  };
}

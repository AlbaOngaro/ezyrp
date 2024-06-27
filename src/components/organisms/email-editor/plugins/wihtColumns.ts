import { Editor } from "slate";

export function withColumns(editor: Editor) {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "row" ? true : isVoid(element);
  };

  return editor;
}

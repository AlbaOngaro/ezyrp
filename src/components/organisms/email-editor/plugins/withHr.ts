import { Editor } from "slate";

export function withHr(editor: Editor) {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "hr" ? true : isVoid(element);
  };

  return editor;
}

import { Editor } from "slate";

export function withSections(editor: Editor) {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "section" ? true : isVoid(element);
  };

  return editor;
}

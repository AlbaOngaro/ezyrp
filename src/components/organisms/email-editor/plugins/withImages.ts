import { Editor } from "slate";

export function withImages(editor: Editor) {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "img" ? true : isVoid(element);
  };

  return editor;
}

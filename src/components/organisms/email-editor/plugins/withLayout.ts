import { Editor } from "slate";

export function withLayout(editor: Editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    return normalizeNode([node, path]);
  };

  return editor;
}

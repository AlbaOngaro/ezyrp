import { Editor, Element, Transforms } from "slate";

export function withIds(editor: Editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node) && !node.id) {
      console.log("Adding id to node", node, path);
      Transforms.setNodes(
        editor,
        { id: Math.random().toString(36).substr(2, 9) },
        { at: path },
      );
      return;
    }

    normalizeNode(entry);
  };

  return editor;
}

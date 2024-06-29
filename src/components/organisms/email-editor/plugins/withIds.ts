import { Editor, Element, Transforms } from "slate";
import { validate } from "uuid";
import { getValidUuid } from "lib/utils/getValidUuid";

export function withIds(editor: Editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node)) {
      const { skipUpdate = false } = node;

      if ((!node.id || !validate(node.id)) && !skipUpdate) {
        Transforms.setNodes(editor, { id: getValidUuid() }, { at: path });
        return;
      }
    }

    normalizeNode(entry);
  };

  return editor;
}

import { useMemo } from "react";
import { Path } from "slate";
import { useSlateStatic } from "slate-react";
import { useGetSlatePath } from "./useGetSlatePath";
import { CustomElement } from "types/slate";

type Options = {
  exact?: boolean;
};

export function useGetIsSelected(
  element: CustomElement,
  { exact = false }: Options = {},
) {
  const editor = useSlateStatic();
  const path = useGetSlatePath(element);

  return useMemo(() => {
    if (editor.selection && Path.isPath(editor.selection.anchor.path)) {
      if (exact) {
        // editor selection is always a text node.
        // For exact matches check if current selection
        // is direct child of the current element's path
        return Path.isChild(editor.selection.anchor.path, path);
      }

      return Path.isDescendant(editor.selection.anchor.path, path);
    }

    return false;
  }, [editor.selection, path, exact]);
}

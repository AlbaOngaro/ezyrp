import { useMemo } from "react";
import { Path } from "slate";
import { useSlateStatic } from "slate-react";
import { useGetSlatePath } from "./useGetSlatePath";
import { CustomElement } from "types/slate";

export function useGetIsSelected(element: CustomElement) {
  const editor = useSlateStatic();
  const path = useGetSlatePath(element);

  return useMemo(() => {
    if (
      editor.selection &&
      Path.isPath(editor.selection.anchor.path) &&
      Path.isDescendant(editor.selection.anchor.path, path)
    ) {
      return true;
    }

    return false;
  }, [editor.selection, path]);
}

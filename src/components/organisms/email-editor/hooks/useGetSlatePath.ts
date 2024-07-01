import { useMemo } from "react";
import { ReactEditor, useSlateWithV } from "slate-react";
import { CustomElement } from "types/slate";

export function useGetSlatePath(element: CustomElement) {
  const { editor, v } = useSlateWithV();

  return useMemo(() => {
    return ReactEditor.findPath(editor, element);
    // passing v to the deps array to force useMemo to recompute the path
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v, editor, element]);
}

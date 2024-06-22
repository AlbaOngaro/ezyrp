import { Text, Element } from "slate";
import { useSlateStatic } from "slate-react";

export function useGetSortableItems() {
  const editor = useSlateStatic();
  return editor.children.filter((child) => !Text.isText(child)) as Element[];
}

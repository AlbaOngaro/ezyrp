import { Text, Element } from "slate";
import { useSlateStatic } from "slate-react";

export function useGetItems() {
  const editor = useSlateStatic();
  return editor.children.filter((child) => !Text.isText(child)) as Element[];
}

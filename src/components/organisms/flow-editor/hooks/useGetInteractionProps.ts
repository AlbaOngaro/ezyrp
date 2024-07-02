import { ReactFlowProps } from "reactflow";

export function useGetInteractionProps(
  mode: "edit" | "view",
): Partial<ReactFlowProps> {
  if (mode === "view") {
    return {
      nodesDraggable: false,
      nodesConnectable: false,
      nodesFocusable: false,
      edgesFocusable: false,
      elementsSelectable: false,
    };
  }

  return {};
}

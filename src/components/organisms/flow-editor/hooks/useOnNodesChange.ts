import { useCallback } from "react";
import { NodeChange, Node, applyNodeChanges } from "reactflow";

import { NodeData, NodeType } from "../types";
import { useNodes } from "./useNodes";

export function useOnNodesChange() {
  const [, setNodes] = useNodes();

  return useCallback(
    (changes: NodeChange[]) =>
      setNodes(
        (nds) => applyNodeChanges(changes, nds) as Node<NodeData, NodeType>[],
      ),
    [setNodes],
  );
}

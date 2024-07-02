import { Dispatch, SetStateAction, useContext } from "react";
import { Node } from "reactflow";

import { WorkflowContext } from "../context";
import { NodeData } from "../types";

export function useNodes(): [
  Node<NodeData>[],
  Dispatch<SetStateAction<Node<NodeData>[]>>,
] {
  const { nodes, setNodes } = useContext(WorkflowContext);
  return [nodes, setNodes];
}

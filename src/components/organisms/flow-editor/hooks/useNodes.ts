import { Dispatch, SetStateAction, useContext } from "react";
import { Node } from "reactflow";

import { WorkflowContext } from "../context";
import { NodeData, NodeType } from "../types";

export function useNodes(): [
  Node<NodeData, NodeType>[],
  Dispatch<SetStateAction<Node<NodeData, NodeType>[]>>,
] {
  const { nodes, setNodes } = useContext(WorkflowContext);
  return [nodes, setNodes];
}

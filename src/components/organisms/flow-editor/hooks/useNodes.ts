import { Dispatch, SetStateAction, useContext } from "react";
import { Node } from "reactflow";

import { WorkflowContext } from "../context";

export function useNodes(): [Node[], Dispatch<SetStateAction<Node[]>>] {
  const { nodes, setNodes } = useContext(WorkflowContext);
  return [nodes, setNodes];
}

import { Dispatch, SetStateAction, useContext } from "react";
import { Edge } from "reactflow";

import { WorkflowContext } from "../context";

export function useEdges(): [Edge[], Dispatch<SetStateAction<Edge[]>>] {
  const { edges, setEdges } = useContext(WorkflowContext);
  return [edges, setEdges];
}

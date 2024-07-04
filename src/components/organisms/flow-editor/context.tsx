import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Node, Edge } from "reactflow";
import { isEqual } from "lodash";

import { NodeData, NodeType } from "./types";
import { Doc, Id } from "convex/_generated/dataModel";

type WorkflowContextValue = {
  id: Id<"workflows">;
  nodes: Node<NodeData, NodeType>[];
  setNodes: Dispatch<SetStateAction<Node<NodeData, NodeType>[]>>;
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  hasChanges: boolean;
};

export const WorkflowContext = createContext<WorkflowContextValue>({
  id: "" as Id<"workflows">,
  nodes: [],
  setNodes: () => [],
  edges: [],
  setEdges: () => [],
  hasChanges: false,
});

export function WorkflowProvider({
  children,
  workflow,
}: PropsWithChildren<{
  workflow: Doc<"workflows">;
}>) {
  const [nodes, setNodes] = useState<Node<NodeData, NodeType>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    setEdges(workflow.edges);
    setNodes(workflow.nodes);
  }, [workflow]);

  return (
    <WorkflowContext.Provider
      value={{
        id: workflow._id,
        nodes,
        setNodes,
        edges,
        setEdges,
        hasChanges:
          !isEqual(workflow.nodes, nodes) || !isEqual(workflow.edges, edges),
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

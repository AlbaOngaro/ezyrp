import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";
import { Node, Edge } from "reactflow";
import { Doc, Id } from "convex/_generated/dataModel";

type WorkflowContextValue = {
  id: Id<"workflows">;
  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
};

export const WorkflowContext = createContext<WorkflowContextValue>({
  id: "" as Id<"workflows">,
  nodes: [],
  setNodes: () => [],
  edges: [],
  setEdges: () => [],
});

export function WorkflowProvider({
  children,
  workflow,
}: PropsWithChildren<{
  workflow: Doc<"workflows">;
}>) {
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  return (
    <WorkflowContext.Provider
      value={{
        id: workflow._id,
        nodes,
        setNodes,
        edges,
        setEdges,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

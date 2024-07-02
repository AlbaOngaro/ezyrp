import { getConnectedEdges } from "reactflow";
import { useEdges } from "./useEdges";
import { useNodes } from "./useNodes";

type ReturnType =
  | {
    valid: true;
    error: undefined;
  }
  | {
    valid: false;
    error: string;
  };

export function useFlowValidationState(): ReturnType {
  const [edges] = useEdges();
  const [nodes] = useNodes();

  const connections = getConnectedEdges(nodes, edges);

  if (nodes.length !== 2) {
    return {
      valid: false,
      error: "You need to have exactly 2 nodes.",
    };
  }

  if (connections.length === 0) {
    return {
      valid: false,
      error: "You need to connect the nodes to each other.",
    };
  }

  if (nodes.every((node) => node.type === "action")) {
    return {
      valid: false,
      error: "You need to have at least one trigger node.",
    };
  }

  if (nodes.every((node) => node.type === "trigger")) {
    return {
      valid: false,
      error: "You need to have at least one action node.",
    };
  }

  return {
    valid: true,
    error: undefined,
  };
}

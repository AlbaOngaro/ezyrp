import { getConnectedEdges } from "reactflow";
import { useEdges } from "./useEdges";
import { useNodes } from "./useNodes";

type ValidState = {
  valid: true;
  errors: never[];
};

export enum ErrorCode {
  MissingConnection = "MISSING_CONNECTION",
  MissingTriggerNode = "MISSING_TRIGGER_NODE",
  MissingActionNode = "MISSING_ACTION_NODE",
}

export type Error = {
  message: string;
  code: ErrorCode;
};

type ErrorState = {
  valid: false;
  errors: Error[];
};

type ReturnType = ValidState | ErrorState;

export function useFlowValidationState(): ReturnType {
  const [edges] = useEdges();
  const [nodes] = useNodes();

  let valid = true;
  const errors = [];

  const connections = getConnectedEdges(nodes, edges);

  if (nodes.every((node) => node.type === "action")) {
    valid = false;
    errors.push({
      code: ErrorCode.MissingTriggerNode,
      message: "You need to have at least one trigger node.",
    });
  }

  if (nodes.every((node) => node.type === "trigger")) {
    valid = false;
    errors.push({
      code: ErrorCode.MissingActionNode,
      message: "You need to have at least one action node.",
    });
  }

  if (connections.length === 0) {
    valid = false;

    errors.push({
      code: ErrorCode.MissingConnection,
      message: "You need to connect the nodes to each other.",
    });
  }

  if (valid) {
    return {
      valid: true,
      errors: [],
    };
  }

  return {
    valid,
    errors,
  };
}

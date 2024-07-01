import { Edge, NodeProps, EdgeTypes, Node } from "reactflow";
import { ComponentType } from "react";

import { TriggerNode } from "./nodes/trigger";
import { ActionNode } from "./nodes/action";
import { DefaultEdge } from "./edges/default";

import { NodeData, NodeType } from "./types";

export const initialNodes: Node<NodeData, NodeType>[] = [
  {
    id: "1",
    type: "trigger",
    position: { x: 0, y: 100 },
    data: { label: "Trigger", triggerSpecificKey: "triggerSpecificValue" },
  },
  {
    id: "2",
    type: "action",
    position: { x: 300, y: 100 },
    data: { label: "Action" },
  },
];

export const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

export const nodeTypes: Record<NodeType, ComponentType<NodeProps>> = {
  trigger: TriggerNode,
  action: ActionNode,
};

export const edgeTypes: EdgeTypes = {
  default: DefaultEdge,
};

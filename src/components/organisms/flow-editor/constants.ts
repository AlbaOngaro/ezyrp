import { Edge, NodeProps, EdgeTypes, Node } from "reactflow";
import { ComponentType } from "react";

import { TriggerNode } from "./nodes/trigger";
import { ActionNode } from "./nodes/action";
import { DefaultEdge } from "./edges/default";

import { NodeData, NodeType } from "./types";

export const initialNodes: Node<NodeData, NodeType>[] = [];
export const initialEdges: Edge[] = [];

export const nodeTypes: Record<NodeType, ComponentType<NodeProps>> = {
  trigger: TriggerNode,
  action: ActionNode,
};

export const edgeTypes: EdgeTypes = {
  default: DefaultEdge,
};

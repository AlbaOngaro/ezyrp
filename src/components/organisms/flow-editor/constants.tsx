import { Edge, NodeProps, EdgeTypes, Node } from "reactflow";
import { ComponentType } from "react";

import { TriggerNode } from "./components/nodes/trigger";
import { ActionNode } from "./components/nodes/action";
import { DefaultEdge } from "./components/edges/default";

import { ActionNodeData, NodeData, NodeType, TriggerNodeData } from "./types";

export const initialNodes: Node<NodeData, NodeType>[] = [];
export const initialEdges: Edge[] = [];

export const nodeTypes: Record<NodeType, ComponentType<NodeProps<NodeData>>> = {
  trigger: (props) => (
    <TriggerNode
      {...(props as NodeProps<TriggerNodeData> & { type: "trigger" })}
    />
  ),
  action: (props) => (
    <ActionNode
      {...(props as NodeProps<ActionNodeData> & { type: "action" })}
    />
  ),
};

export const edgeTypes: EdgeTypes = {
  default: DefaultEdge,
};

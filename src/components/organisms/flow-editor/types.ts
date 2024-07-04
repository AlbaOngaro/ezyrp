import { Node } from "reactflow";

export type NodeType = "trigger" | "action";

import { Event, Action } from "convex/workflows";

interface BaseNodeData {
  label: string;
}

export interface ActionNodeData extends BaseNodeData {
  action: Action;
}

export interface TriggerNodeData extends BaseNodeData {
  event: Event;
}

export type NodeData = ActionNodeData | TriggerNodeData;

export function isActionNode(
  node: Pick<Node, "type">,
): node is Node<ActionNodeData, "action"> {
  return node.type === "action";
}

export function isTriggerNode(
  node: Pick<Node, "type">,
): node is Node<TriggerNodeData, "trigger"> {
  return node.type === "trigger";
}

import { Node } from "reactflow";

export type NodeType = "trigger" | "action";

import { Event, Action } from "convex/workflows";
import { Id } from "convex/_generated/dataModel";

interface BaseNodeData {
  label: string;
}

interface BaseActionNodeData extends BaseNodeData {
  action: Action;
}

interface EmailActionNodeData extends BaseActionNodeData {
  action: "email";
  template: Id<"emails">;
}

interface SmsActionNodeData extends BaseActionNodeData {
  action: "sms";
}

export type ActionNodeData = EmailActionNodeData | SmsActionNodeData;

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

export function isEmailActionNode(
  node: Pick<Node, "type" | "data">,
): node is Node<EmailActionNodeData, "action"> {
  return isActionNode(node) && node.data.action === "email";
}

export function isSmsActionNode(
  node: Pick<Node, "type" | "data">,
): node is Node<SmsActionNodeData, "action"> {
  return isActionNode(node) && node.data.action === "sms";
}

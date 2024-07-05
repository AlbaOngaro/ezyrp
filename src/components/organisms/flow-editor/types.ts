import { Node } from "reactflow";

export type NodeType = "trigger" | "action";

import {
  AnyEvent,
  Action,
  EventEvents,
  InvoiceEvents,
  CustomerEvents,
} from "convex/workflows";
import { Id } from "convex/_generated/dataModel";

interface BaseNodeData {
  label: string;
}

interface BaseActionNodeData extends BaseNodeData {
  action: Action;
}

export interface EmailActionNodeData extends BaseActionNodeData {
  action: "email";
  template: Id<"emails">;
}

interface SmsActionNodeData extends BaseActionNodeData {
  action: "sms";
}

export type ActionNodeData = EmailActionNodeData | SmsActionNodeData;

export interface TriggerNodeBaseData extends BaseNodeData {
  event: AnyEvent;
}

export interface EventTriggerNodeData extends TriggerNodeBaseData {
  event: EventEvents;
  delay: number;
}

export interface CustomerTriggerNodeData extends TriggerNodeBaseData {
  event: CustomerEvents;
}

export interface InvoiceTriggerNodeData extends TriggerNodeBaseData {
  event: InvoiceEvents;
}

export type TriggerNodeData =
  | EventTriggerNodeData
  | CustomerTriggerNodeData
  | InvoiceTriggerNodeData;

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

export function isEventTriggerNode(
  node: Pick<Node, "type" | "data">,
): node is Node<EventTriggerNodeData, "trigger"> {
  return (
    isTriggerNode(node) &&
    ["event:upcoming", "event:days-passed"].includes(node.data.event)
  );
}

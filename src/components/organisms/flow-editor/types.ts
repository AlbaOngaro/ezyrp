export type NodeType = "trigger" | "action";

import { Event } from "convex/utils";

export type SelectSetting = {
  type: "select";
  options: { label: string; value: string }[];
  value: { label: string; value: string };
  defaultValue?: { label: string; value: string };
};

type InputSettings = {
  type: "input";
  value: string;
  disabled?: boolean;
};

export type Setting = InputSettings | SelectSetting;

type Settings = Record<string, Setting>;

interface BaseNodeData {
  label: string;
  settings?: Settings;
}

export interface ActionNodeData extends BaseNodeData { }

export interface TriggerNodeData extends BaseNodeData {
  event: Event;
}

export type NodeData = ActionNodeData | TriggerNodeData;

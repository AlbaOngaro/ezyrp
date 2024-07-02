export type NodeType = "trigger" | "action";

type SelectSetting = {
  type: "select";
  options: { label: string; value: string }[];
  value: { label: string; value: string };
  defaultValue?: { label: string; value: string };
};

export type Setting = SelectSetting;

type Settings = Record<string, Setting>;

interface BaseNodeData {
  label: string;
  settings?: Settings;
}

export interface ActionNodeData extends BaseNodeData { }

export interface TriggerNodeData extends BaseNodeData { }

export type NodeData = ActionNodeData | TriggerNodeData;

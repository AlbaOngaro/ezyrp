export type NodeType = "trigger" | "action";

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

export interface ActionNodeData extends BaseNodeData {}

export interface TriggerNodeData extends BaseNodeData {
  event:
    | "customer:created"
    | "customer:birthday"
    | "event:upcoming"
    | "event:days-passed"
    | "invoice:created"
    | "invoice:paid"
    | "invoice:overdue";
}

export type NodeData = ActionNodeData | TriggerNodeData;

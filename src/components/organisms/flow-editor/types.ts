export type NodeType = "trigger" | "action";

export type ActionNodeData = {
  label: string;
};

export type TriggerNodeData = {
  label: string;
};

export type NodeData = ActionNodeData | TriggerNodeData;

import { NodeProps } from "reactflow";

import { TriggerNodeData } from "../../types";

import { BaseNode } from "./base";

export function TriggerNode(
  props: NodeProps<TriggerNodeData> & { type: "trigger" },
) {
  return <BaseNode {...props} />;
}

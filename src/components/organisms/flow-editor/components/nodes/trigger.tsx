import { NodeProps } from "reactflow";

import { TriggerNodeData } from "../../types";

import { BaseNode } from "./base";

export function TriggerNode(props: NodeProps<TriggerNodeData>) {
  return <BaseNode {...props} />;
}

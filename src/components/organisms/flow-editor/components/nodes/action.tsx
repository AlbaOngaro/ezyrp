import { NodeProps } from "reactflow";

import { ActionNodeData } from "../../types";

import { BaseNode } from "./base";

export function ActionNode(props: NodeProps<ActionNodeData>) {
  return <BaseNode {...props} />;
}

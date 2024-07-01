import { NodeProps, Position } from "reactflow";

import { Handle } from "../handle";
import { ActionNodeData } from "../../types";

import { cn } from "lib/utils/cn";

export function ActionNode({ data, selected }: NodeProps<ActionNodeData>) {
  return (
    <div
      className={cn("bg-white border-2 border-white rounded-sm px-6 py-2", {
        "border-black": selected,
      })}
    >
      <Handle type="target" position={Position.Left} />
      {data.label}
    </div>
  );
}

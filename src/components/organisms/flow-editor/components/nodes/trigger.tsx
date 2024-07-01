import { NodeProps, Position } from "reactflow";

import { Handle } from "../handle";
import { TriggerNodeData } from "../../types";

import { cn } from "lib/utils/cn";

export function TriggerNode({ data, selected }: NodeProps<TriggerNodeData>) {
  return (
    <div
      className={cn("bg-white border-2 border-white rounded-sm px-6 py-2", {
        "border-black": selected,
      })}
    >
      {data.label}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

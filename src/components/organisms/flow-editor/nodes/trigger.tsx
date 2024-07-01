import { NodeProps, Position } from "reactflow";
import { Handle } from "../handle";

type TriggerNodeData = {
  label: string;
};

export function TriggerNode({ data }: NodeProps<TriggerNodeData>) {
  return (
    <div className="bg-white border-2 border-blue-300 rounded-sm px-6 py-2">
      {data.label}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

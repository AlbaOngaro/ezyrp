import { NodeProps, Position } from "reactflow";
import { Handle } from "../handle";

type ActionNodeData = {
  label: string;
};

export function ActionNode({ data }: NodeProps<ActionNodeData>) {
  return (
    <div className="bg-white border-2 border-blue-300 rounded-sm px-6 py-2">
      <Handle type="target" position={Position.Left} />
      {data.label}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

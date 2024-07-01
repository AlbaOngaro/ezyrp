import { NodeProps, Handle, Position } from "reactflow";

type DefaultNodeData = {
  label: string;
};

export function DefaultNode({ data }: NodeProps<DefaultNodeData>) {
  return (
    <div className="border-2 border-blue-300 rounded-sm px-6 py-2">
      <Handle type="target" position={Position.Left} />
      {data.label}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

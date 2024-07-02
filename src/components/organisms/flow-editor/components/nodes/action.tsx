import { NodeProps, Position } from "reactflow";

import { useCallback } from "react";
import { Settings, Trash } from "lucide-react";
import { Handle } from "../handle";
import { ActionNodeData } from "../../types";

import { useNodes } from "../../hooks/useNodes";
import { cn } from "lib/utils/cn";
import { Button } from "components/atoms/button";

export function ActionNode({ data, id, selected }: NodeProps<ActionNodeData>) {
  const [_, setNodes] = useNodes();

  const onRemove = useCallback(
    () => setNodes((prev) => prev.filter((node) => node.id !== id)),
    [setNodes, id],
  );

  return (
    <div
      className={cn(
        "relative bg-white border-2 border-white rounded-sm px-6 py-2",
        {
          "border-black": selected,
        },
      )}
    >
      {selected && (
        <div className="flex flex-row bg-gray-300 rounded-sm absolute -top-6 left-0 right-0 w-fit">
          <Button
            size="icon"
            variant="ghost"
            className="w-5 h-5 hover:bg-transparent hover:text-blue-500"
            onClick={onRemove}
          >
            <Trash className="w-3 h-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-5 h-5 hover:bg-transparent hover:text-blue-500"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      )}

      <Handle type="target" position={Position.Left} />
      {data.label}
    </div>
  );
}

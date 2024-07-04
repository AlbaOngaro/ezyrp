import { NodeProps, Position } from "reactflow";

import { useCallback } from "react";
import { Handle } from "../../handle";
import { NodeData, NodeType } from "../../../types";

import { getIconForNode } from "../utils/getIconForNode";
import { Toolbar } from "./toolbar";
import { cn } from "lib/utils/cn";

export function BaseNode(props: NodeProps<NodeData> & { type: NodeType }) {
  const { type, data, selected } = props;

  const renderHandle = useCallback(() => {
    switch (type) {
      case "trigger":
        return <Handle type="source" position={Position.Right} />;
      case "action":
        return <Handle type="target" position={Position.Left} />;
      default:
        return null;
    }
  }, [type]);

  return (
    <div
      className={cn(
        "relative bg-white border-2 border-white rounded-sm px-4 py-2 flex flex-row items-center gap-2",
        {
          "border-black": selected,
        },
      )}
    >
      {selected && <Toolbar {...props} />}
      {renderHandle()}
      {getIconForNode({
        type,
        data,
      })}
      {data.label}
    </div>
  );
}

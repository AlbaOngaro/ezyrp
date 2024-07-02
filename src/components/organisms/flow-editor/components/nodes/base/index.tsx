import { NodeProps, Position } from "reactflow";

import { Handle } from "../../handle";
import { NodeData, NodeType } from "../../../types";

import { Toolbar } from "./toolbar";
import { cn } from "lib/utils/cn";

export function BaseNode(props: NodeProps<NodeData> & { type: NodeType }) {
  const { type, data, selected } = props;

  return (
    <div
      className={cn(
        "relative bg-white border-2 border-white rounded-sm px-6 py-2",
        {
          "border-black": selected,
        },
      )}
    >
      {selected && <Toolbar {...props} />}

      {(() => {
        switch (type) {
          case "trigger":
            return <Handle type="source" position={Position.Right} />;
          case "action":
            return <Handle type="target" position={Position.Left} />;
          default:
            return null;
        }
      })()}

      {data.label}
    </div>
  );
}

import { NodeProps, Position } from "reactflow";

import { useCallback } from "react";
import { TriangleAlert } from "lucide-react";
import { Handle } from "../../handle";
import { NodeData, NodeType } from "../../../types";

import { getIconForNode } from "../utils/getIconForNode";
import { Toolbar } from "./toolbar";
import { cn } from "lib/utils/cn";
import { useNodeValidationState } from "components/organisms/flow-editor/hooks/useNodeValidationState";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/atoms/tooltip";

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

  const { success, error } = useNodeValidationState({ type, data });

  return (
    <div
      className={cn(
        "relative bg-white border-2 border-white rounded-sm px-4 py-2 flex flex-row items-center gap-2",
        {
          "border-black": selected,
          "pr-8": !success,
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

      {!success && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TriangleAlert className="w-4 h-4 text-red-500 absolute top-1 right-1" />
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              {error?.issues.map((issue) => issue.message)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

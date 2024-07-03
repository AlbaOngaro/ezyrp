import { useState, DragEvent } from "react";

import { getIconForNode } from "../nodes/utils/getIconForNode";
import {
  Error,
  ErrorCode,
  useFlowValidationState,
} from "../../hooks/useFlowValidationState";
import { NodeType } from "../../types";
import { Node as Props } from "./types";

import { cn } from "lib/utils/cn";

function getIsDraggable(type?: NodeType, errors: Error[] = []) {
  switch (type) {
    case "trigger":
      return errors.some(
        (error) => error.code === ErrorCode.MissingTriggerNode,
      );
    case "action": {
      debugger;
      return errors.some((error) => error.code === ErrorCode.MissingActionNode);
    }
    default:
      return false;
  }
}

export function DraggableNode({ type, data }: Props) {
  const { errors } = useFlowValidationState();
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    setIsDragging(true);

    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type, data }),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  const draggable = getIsDraggable(type, errors);

  return (
    <div
      className={cn(
        "bg-gray-100 rounded-sm p-4 flex flex-col gap-2 justify-start items-start",
        {
          "cursor-grabbing": isDragging,
          "cursor-pointer": draggable,
          "cursor-not-allowed text-gray-400": !draggable,
        },
      )}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable={draggable}
    >
      {getIconForNode({
        type,
        data,
        variant: "ghost",
      })}
      {data.label}
    </div>
  );
}

import { useState, DragEvent } from "react";

import { getIconForNode } from "../nodes/utils/getIconForNode";
import { useNodes } from "../../hooks/useNodes";
import { Node as Props } from "./types";

import { cn } from "lib/utils/cn";

export function DraggableNode({ type, data }: Props) {
  const [nodes] = useNodes();

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

  const draggable = !nodes.some((node) => node.type === type);

  return (
    <div
      className={cn(
        "bg-gray-100 rounded-sm p-4 flex flex-col gap-2 justify-start items-start cursor-pointer",
        {
          "cursor-grabbing": isDragging,
          "text-gray-400 cursor-not-allowed": !draggable,
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

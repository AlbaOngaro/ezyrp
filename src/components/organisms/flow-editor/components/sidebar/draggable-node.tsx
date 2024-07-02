import { useState, DragEvent } from "react";
import { getIconForNode } from "../nodes/utils/getIconForNode";
import { Node as Props } from "./types";
import { cn } from "lib/utils/cn";

export function DraggableNode({ type, data }: Props) {
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

  return (
    <div
      className={cn(
        "cursor-pointer bg-gray-100 rounded-sm p-4 flex flex-col gap-2 justify-start items-start",
        {
          "cursor-grabbing": isDragging,
        },
      )}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable
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

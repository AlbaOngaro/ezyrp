import { DragEvent } from "react";
import { nodeTypes } from "./constants";
import { Heading } from "components/atoms/heading";
import { cn } from "lib/utils/cn";

type NodeTypes = typeof nodeTypes;

type Props = {
  type: keyof NodeTypes;
};

function Node({ type }: Props) {
  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={cn("bg-white border-2 rounded-sm px-6 py-2", {
        "border-orange-300": type === "action",
        "border-green-300": type === "trigger",
      })}
      onDragStart={onDragStart}
      draggable
    >
      {type}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-4">
      <Heading
        title="Actions"
        description="You can drag these nodes to the pane on the right."
        className="sm:flex-none"
      />

      <Node type="trigger" />
      <Node type="action" />
    </aside>
  );
}

import { DragEvent, PropsWithChildren, useState } from "react";
import {
  Cake,
  CalendarClock,
  CalendarRange,
  Minus,
  UserPlus,
} from "lucide-react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { nodeTypes } from "../constants";
import { NodeData } from "../types";
import { Heading } from "components/atoms/heading";
import { cn } from "lib/utils/cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "components/atoms/collapsible";
import { Button } from "components/atoms/button";

type NodeTypes = typeof nodeTypes;

type Props = PropsWithChildren<{
  type: keyof NodeTypes;
  data: NodeData;
}>;

function Node({ type, data, children }: Props) {
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
      {children}
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

      <Collapsible defaultOpen>
        <strong className="flex items-center gap-2">
          <span className="bg-orange-300 inline-block rounded-full w-4 h-4" />
          Triggers
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="ml-auto hover:bg-transparent">
              <Minus className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
        </strong>

        <CollapsibleContent className="grid grid-cols-2 auto-rows-fr gap-2">
          <Node type="trigger" data={{ label: "User Creation" }}>
            <UserPlus className="w-6 h-6" />
            User creation
          </Node>
          <Node type="trigger" data={{ label: "User Birthday" }}>
            <Cake className="w-6 h-6" /> User's birthday
          </Node>
          <Node type="trigger" data={{ label: "Event Upcoming" }}>
            <CalendarClock className="w-6 h-6" /> Event upcoming
          </Node>
          <Node type="trigger" data={{ label: "Days passed" }}>
            <CalendarRange className="w-6 h-6" /> Days passed since event
          </Node>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <strong className="flex items-center gap-2">
          <span className="bg-green-300 inline-block rounded-full w-4 h-4" />
          Actions
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="ml-auto hover:bg-transparent">
              <Minus className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
        </strong>

        <CollapsibleContent className="grid grid-cols-2 auto-rows-fr gap-2">
          <Node type="action" data={{ label: "Send Email" }}>
            <EnvelopeClosedIcon className="w-6 h-6" /> Email
          </Node>
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
}

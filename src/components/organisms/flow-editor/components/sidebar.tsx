import { DragEvent, PropsWithChildren } from "react";
import { Cake, CalendarClock, CalendarRange, UserPlus } from "lucide-react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { nodeTypes } from "../constants";
import { NodeData } from "../types";
import { Heading } from "components/atoms/heading";
import { cn } from "lib/utils/cn";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/atoms/accordion";

type NodeTypes = typeof nodeTypes;

type Props = PropsWithChildren<{
  type: keyof NodeTypes;
  data: NodeData;
}>;

function Node({ type, data, children }: Props) {
  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type, data }),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={cn(
        "bg-white border-2 rounded-sm px-4 py-2 flex gap-2 flex-row items-center",
        {
          "border-orange-300": type === "action",
          "border-green-300": type === "trigger",
        },
      )}
      onDragStart={onDragStart}
      draggable
    >
      {children}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex flex-col">
      <Heading
        title="Actions"
        description="You can drag these nodes to the pane on the right."
        className="sm:flex-none mb-4"
      />

      <strong>Triggers</strong>
      <Accordion type="single" collapsible>
        <AccordionItem value="user">
          <AccordionTrigger>Users</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <Node type="trigger" data={{ label: "User Creation" }}>
              <UserPlus className="w-4 h-4" /> Creation
            </Node>
            <Node type="trigger" data={{ label: "User Birthday" }}>
              <Cake className="w-4 h-4" /> Birthday
            </Node>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
        <AccordionItem value="event">
          <AccordionTrigger>Events</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <Node type="trigger" data={{ label: "Event Upcoming" }}>
              <CalendarClock className="w-4 h-4" /> Upcoming
            </Node>
            <Node type="trigger" data={{ label: "Days passed" }}>
              <CalendarRange className="w-4 h-4" /> Passed
            </Node>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <strong className="mt-4">Actions</strong>
      <Accordion type="single" collapsible>
        <AccordionItem value="notifications">
          <AccordionTrigger>Notifications</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <Node type="action" data={{ label: "Send Email" }}>
              <EnvelopeClosedIcon className="w-4 h-4" /> Email
            </Node>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}

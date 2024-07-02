import { Minus } from "lucide-react";
import { ACTIONS, TRIGGERS } from "./constants";
import { DraggableNode } from "./draggable-node";
import { Heading } from "components/atoms/heading";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "components/atoms/collapsible";
import { Button } from "components/atoms/button";

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
          {TRIGGERS.map((trigger, i) => (
            <DraggableNode key={`trigger-${i}`} {...trigger} />
          ))}
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
          {ACTIONS.map((action, i) => (
            <DraggableNode key={`trigger-${i}`} {...action} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
}

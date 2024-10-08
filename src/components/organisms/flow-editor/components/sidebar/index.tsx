import { Minus } from "lucide-react";
import { useGetAction } from "./hooks/useGetActions";
import { DraggableNode } from "./draggable-node";
import { useGetTriggers } from "./hooks/useGetTriggers";
import { Heading } from "components/atoms/heading";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "components/atoms/collapsible";
import { Button } from "components/atoms/button";
import { cn } from "lib/utils/cn";

type Props = {
  className?: string;
};

export function Sidebar({ className }: Props) {
  const actions = useGetAction();
  const triggers = useGetTriggers();

  return (
    <aside
      className={cn("flex flex-col gap-4 h-full overflow-scroll", className)}
    >
      <Heading
        title="Nodes"
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
          {triggers.map((trigger, i) => (
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
          {actions.map((action, i) => (
            <DraggableNode key={`trigger-${i}`} {...action} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
}

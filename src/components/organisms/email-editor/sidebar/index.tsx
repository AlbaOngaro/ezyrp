import * as Portal from "@radix-ui/react-portal";
import { ReactEditor, useSlateStatic } from "slate-react";
import { Fragment } from "react";
import { Minus } from "lucide-react";
import { DraggableButton } from "./draggable-button";
import { DraggableImg } from "./draggable-image";
import { DraggableSeparator } from "./draggable-separator";
import { DraggableColumns } from "./draggable-columns";
import { Heading } from "components/atoms/heading";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "components/atoms/collapsible";
import { Button } from "components/atoms/button";

type Props = {
  container: HTMLElement;
};

export function Sidebar({ container }: Props) {
  const editor = useSlateStatic();
  const readOnly = ReactEditor.isReadOnly(editor);

  if (readOnly) {
    return null;
  }

  return (
    <Portal.Root asChild container={container}>
      <Fragment>
        <Heading
          title="Components"
          description="You can drag these components to the pane on the right."
          className="sm:flex-none"
        />

        <Collapsible defaultOpen>
          <strong className="flex items-center gap-2">
            <span className="bg-purple-300 inline-block rounded-full w-4 h-4" />
            Content
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="ml-auto hover:bg-transparent">
                <Minus className="w-4 h-4" />
              </Button>
            </CollapsibleTrigger>
          </strong>

          <CollapsibleContent className="grid grid-cols-2 auto-rows-fr gap-2">
            <DraggableButton />
            <DraggableImg />
            <DraggableSeparator />
            <DraggableColumns />
          </CollapsibleContent>
        </Collapsible>
      </Fragment>
    </Portal.Root>
  );
}

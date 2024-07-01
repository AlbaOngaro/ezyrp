import * as Portal from "@radix-ui/react-portal";
import { ReactEditor, useSlateStatic } from "slate-react";
import { Fragment } from "react";
import { DraggableButton } from "./draggable-button";
import { DraggableImg } from "./draggable-image";
import { DraggableSeparator } from "./draggable-separator";
import { DraggableColumns } from "./draggable-columns";
import { H4 } from "components/atoms/typography";

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
        <H4 className="mb-4">Components</H4>

        <div className="grid grid-cols-2 gap-4">
          <DraggableButton />
          <DraggableImg />
          <DraggableSeparator />
          <DraggableColumns />
        </div>
      </Fragment>
    </Portal.Root>
  );
}

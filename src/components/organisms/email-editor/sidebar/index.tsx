import * as Portal from "@radix-ui/react-portal";
import { ReactEditor, useSlateStatic } from "slate-react";
import { Fragment } from "react";
import { DraggableButton } from "./draggable-button";
import { DraggableImg } from "./draggable-image";
import { H4 } from "components/atoms/typography";

type Props = {
  container: HTMLElement;
};

export function Sidebar({ container }: Props) {
  const editor = useSlateStatic();

  const disabled = ReactEditor.isReadOnly(editor);

  return (
    <Portal.Root asChild container={container}>
      <Fragment>
        <H4 className="mb-4">Components</H4>

        <ul className="flex flex-col gap-2">
          <li>
            <DraggableButton disabled={disabled}>Button</DraggableButton>
          </li>
          <li>
            <DraggableImg
              src="/images/undraw_images_re_0kll.svg"
              disabled={disabled}
            />
          </li>
        </ul>
      </Fragment>
    </Portal.Root>
  );
}

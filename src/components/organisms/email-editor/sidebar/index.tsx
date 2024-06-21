import * as Portal from "@radix-ui/react-portal";
import { useSlateStatic } from "slate-react";
import { Fragment } from "react";
import { DraggableButton } from "./draggable-button";
import { DraggableImg } from "./draggable-image";
import { H4 } from "components/atoms/typography";

type Props = {
  container: HTMLElement;
};

export function Sidebar({ container }: Props) {
  const editor = useSlateStatic();

  return (
    <Portal.Root asChild container={container}>
      <Fragment>
        <H4 className="mb-4">Components</H4>

        <ul className="flex flex-col gap-2">
          <li>
            <DraggableButton editor={editor}>Button</DraggableButton>
          </li>
          <li>
            <DraggableImg
              src="/images/undraw_images_re_0kll.svg"
              editor={editor}
            />
          </li>
        </ul>
      </Fragment>
    </Portal.Root>
  );
}

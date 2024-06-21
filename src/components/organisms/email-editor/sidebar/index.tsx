import { Editor } from "slate";
import { DraggableButton } from "./draggable-button";
import { DraggableImg } from "./draggable-image";
import { H4 } from "components/atoms/typography";

type Props = {
  editor: Editor;
};

export function Sidebar({ editor }: Props) {
  return (
    <aside className="border-l h-full p-4">
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
    </aside>
  );
}

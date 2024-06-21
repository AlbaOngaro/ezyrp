import { Editor } from "slate";
import { ReactEditor } from "slate-react";
import { useDraggable } from "@dnd-kit/core";
import { Image } from "lucide-react";
import { ImgElement } from "types/slate";
import { Card } from "components/atoms/card";

type Props = {
  editor: Editor;
  src: string;
};

export function DraggableImg({ src, editor }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "img",
    disabled: ReactEditor.isReadOnly(editor),
    data: {
      id: Math.random().toString(36).substr(2, 9),
      type: "img",
      src: "/images/undraw_images_re_0kll.svg",
      children: [{ text: "" }],
    } satisfies ImgElement,
  });

  return (
    <Card
      className="p-2 aspect-square w-full max-w-[12rem] flex justify-center items-center"
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : "unset",
      }}
      {...listeners}
      {...attributes}
    >
      <Image className="w-12 h-12" />
    </Card>
  );
}

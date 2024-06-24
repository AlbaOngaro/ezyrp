import { useDraggable } from "@dnd-kit/core";
import { Image } from "lucide-react";
import { Transform, usePrevious } from "@dnd-kit/utilities";
import { useRef } from "react";

import { useGetSortableItems } from "../editable/hooks/useGetSortableItems";
import { ImgElement } from "types/slate";
import { Card } from "components/atoms/card";

type Props = {
  disabled?: boolean;
  src: string;
};

const DRAGGABLE_IMG_ID = "draggable-img";

export function DraggableImg({ disabled }: Props) {
  const items = useGetSortableItems();
  const elTransform = useRef<Transform | null>(null);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform } =
    useDraggable({
      id: DRAGGABLE_IMG_ID,
      disabled,
      data: {
        id: DRAGGABLE_IMG_ID,
        type: "img",
        src: "/images/undraw_images_re_0kll.svg",
        children: [{ text: "" }],
      } satisfies ImgElement,
    });
  const prevTransform = usePrevious(transform);

  if (items.some((item) => item.id === DRAGGABLE_IMG_ID)) {
    if (!elTransform.current) {
      elTransform.current = transform;
    }

    return (
      <Card
        className="p-2 aspect-square w-full max-w-[12rem] flex justify-center items-center"
        ref={setActivatorNodeRef}
        style={{
          transform: (() => {
            if (elTransform.current && transform && prevTransform) {
              const deltaX =
                prevTransform.x === elTransform.current.x
                  ? 0
                  : transform.x - prevTransform.x;
              const x = elTransform.current.x + deltaX;
              const y = elTransform.current.y + transform.y;

              elTransform.current = {
                ...elTransform.current,
                x,
              };

              return `translate3d(${x}px, ${y}px, 0)`;
            }

            return "unset";
          })(),
        }}
        {...listeners}
      >
        {/* eslint-disable-next-line */}
        <Image className="w-12 h-12" />
      </Card>
    );
  }

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
      {/* eslint-disable-next-line */}
      <Image className="w-12 h-12" />
    </Card>
  );
}

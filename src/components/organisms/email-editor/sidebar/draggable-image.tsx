import { Image } from "lucide-react";

import { DraggableWrapper } from "./draggable-wrapper";
import { Card } from "components/atoms/card";
import { ImgElement } from "types/slate";

type Props = {
  disabled?: boolean;
  src: string;
};

const DRAGGABLE_IMG_ID = "draggable-img";
const DATA = {
  id: DRAGGABLE_IMG_ID,
  type: "img",
  src: "/images/undraw_images_re_0kll.svg",
  children: [{ text: "" }],
} satisfies ImgElement;

export function DraggableImg({ disabled }: Props) {
  return (
    <DraggableWrapper id={DRAGGABLE_IMG_ID} disabled={disabled} data={DATA}>
      {({ ref, transform, listeners, attributes }) => (
        <Card
          className="p-2 aspect-square w-full max-w-[12rem] flex justify-center items-center"
          ref={ref}
          style={{
            transform,
          }}
          {...listeners}
          {...attributes}
        >
          {/* eslint-disable-next-line */}
          <Image className="w-12 h-12" />
        </Card>
      )}
    </DraggableWrapper>
  );
}

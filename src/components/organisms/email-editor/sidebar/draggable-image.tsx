import { Image } from "lucide-react";

import { DraggableWrapper } from "./draggable-wrapper";
import { Card } from "components/atoms/card";
import { ImgElement } from "types/slate";

type Props = {
  disabled?: boolean;
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
          className="bg-gray-100 rounded-sm p-4 flex flex-col gap-2 justify-start items-start cursor-pointer"
          ref={ref}
          style={{
            transform,
          }}
          {...listeners}
          {...attributes}
        >
          {/* eslint-disable-next-line */}
          <Image className="h-6 w-6" />
          Image
        </Card>
      )}
    </DraggableWrapper>
  );
}

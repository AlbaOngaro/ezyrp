import { PropsWithChildren } from "react";

import { RectangleHorizontal } from "lucide-react";
import { DraggableWrapper } from "./draggable-wrapper";
import { ButtonElement } from "types/slate";
import { Card } from "components/atoms/card";

type Props = PropsWithChildren<{
  disabled?: boolean;
}>;

const DRAGGABLE_BUTTON_ID = "draggable-button";
const DATA = {
  id: DRAGGABLE_BUTTON_ID,
  type: "button",
  href: "",
  style: {
    backgroundColor: "#5F51E8",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
    padding: "12px",
  },
  children: [{ text: "Button" }],
} satisfies ButtonElement;

export function DraggableButton({ disabled }: Props) {
  return (
    <DraggableWrapper id={DRAGGABLE_BUTTON_ID} disabled={disabled} data={DATA}>
      {({ transform, attributes, listeners, ref }) => (
        <Card
          className="p-2 aspect-square w-full max-w-[12rem] flex flex-col justify-center items-center"
          ref={ref}
          style={{
            transform,
          }}
          {...listeners}
          {...attributes}
        >
          <RectangleHorizontal className="w-12 h-12" />
          Button
        </Card>
      )}
    </DraggableWrapper>
  );
}

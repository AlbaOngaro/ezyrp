import { PropsWithChildren } from "react";

import { RectangleHorizontal } from "lucide-react";
import { DraggableWrapper } from "./draggable-wrapper";
import { ButtonElement } from "types/slate";

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
        <div
          className="bg-gray-100 rounded-sm p-4 flex flex-col gap-2 justify-start items-start cursor-pointer"
          ref={ref}
          style={{
            transform,
          }}
          {...listeners}
          {...attributes}
        >
          <RectangleHorizontal className="h-6 w-6" />
          Button
        </div>
      )}
    </DraggableWrapper>
  );
}

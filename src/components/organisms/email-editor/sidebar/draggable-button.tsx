import { PropsWithChildren } from "react";

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

export function DraggableButton({ disabled, children }: Props) {
  return (
    <DraggableWrapper id={DRAGGABLE_BUTTON_ID} disabled={disabled} data={DATA}>
      {({ transform, attributes, listeners, ref }) => (
        <button
          ref={ref}
          style={{
            ...DATA.style,
            width: "100%",
            zIndex: 1000,
            transform,
          }}
          {...listeners}
          {...attributes}
        >
          {children}
        </button>
      )}
    </DraggableWrapper>
  );
}

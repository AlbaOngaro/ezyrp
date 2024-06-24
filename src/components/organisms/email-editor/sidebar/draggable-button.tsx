import { useDraggable } from "@dnd-kit/core";
import { Transform, usePrevious } from "@dnd-kit/utilities";
import { PropsWithChildren, useRef } from "react";

import { useGetSortableItems } from "../editable/hooks/useGetSortableItems";

import { ButtonElement } from "types/slate";

type Props = PropsWithChildren<{
  disabled?: boolean;
}>;

const DRAGGABLE_BUTTON_ID = "draggable-button";

export function DraggableButton({ disabled, children }: Props) {
  const items = useGetSortableItems();
  const elTransform = useRef<Transform | null>(null);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform } =
    useDraggable({
      id: DRAGGABLE_BUTTON_ID,
      disabled,
      data: {
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
      } satisfies ButtonElement,
    });

  const prevTransform = usePrevious(transform);

  if (items.some((item) => item.id === DRAGGABLE_BUTTON_ID)) {
    if (!elTransform.current) {
      elTransform.current = transform;
    }

    return (
      <button
        ref={setActivatorNodeRef}
        style={{
          width: "100%",
          backgroundColor: "#5F51E8",
          borderRadius: "3px",
          color: "#fff",
          fontSize: "16px",
          textDecoration: "none",
          textAlign: "center",
          display: "block",
          padding: "12px",
          zIndex: 1000,
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
        {children}
      </button>
    );
  }

  return (
    <button
      ref={setNodeRef}
      style={{
        width: "100%",
        backgroundColor: "#5F51E8",
        borderRadius: "3px",
        color: "#fff",
        fontSize: "16px",
        textDecoration: "none",
        textAlign: "center",
        display: "block",
        padding: "12px",
        zIndex: 1000,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : "unset",
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
}

import { Editor } from "slate";
import { ReactEditor } from "slate-react";
import { useDraggable } from "@dnd-kit/core";
import { Transform, usePrevious } from "@dnd-kit/utilities";
import { PropsWithChildren, useRef } from "react";

import { useGetSortableItems } from "../editable/hooks/useGetSortableItems";

import { ButtonElement } from "types/slate";
import { mergeRefs } from "lib/utils/mergeRefs";

type Props = PropsWithChildren<{
  editor: Editor;
}>;

export function DraggableButton({ editor, children }: Props) {
  const items = useGetSortableItems();
  const elTransform = useRef<Transform | null>(null);
  const element = useRef<HTMLButtonElement | null>(null);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform } =
    useDraggable({
      id: "draggable-button",
      disabled: ReactEditor.isReadOnly(editor),
      data: {
        id: "draggable-button",
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

  if (items.some((item) => item.id === "draggable-button")) {
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
              const deltaX = transform.x - prevTransform.x;
              // TODO: fix this logic
              const x = elTransform.current.x + deltaX;
              const y = elTransform.current.y + transform.y;

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
      ref={mergeRefs(setNodeRef, element)}
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

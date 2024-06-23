import { Editor } from "slate";
import { ReactEditor } from "slate-react";
import { useDraggable } from "@dnd-kit/core";
import { PropsWithChildren } from "react";
import { useGetSortableItems } from "../editable/hooks/useGetSortableItems";
import { ButtonElement } from "types/slate";

type Props = PropsWithChildren<{
  editor: Editor;
}>;

export function DraggableButton({ editor, children }: Props) {
  const items = useGetSortableItems();
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

  if (items.some((item) => item.id === "draggable-button")) {
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
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : "unset",
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

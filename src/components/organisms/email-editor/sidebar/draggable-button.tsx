import { Editor } from "slate";
import { ReactEditor } from "slate-react";
import { useDraggable } from "@dnd-kit/core";
import { PropsWithChildren } from "react";
import { ButtonElement } from "types/slate";

type Props = PropsWithChildren<{
  editor: Editor;
}>;

export function DraggableButton({ children, editor }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "button",
    disabled: ReactEditor.isReadOnly(editor),
    data: {
      id: Math.random().toString(36).substr(2, 9),
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

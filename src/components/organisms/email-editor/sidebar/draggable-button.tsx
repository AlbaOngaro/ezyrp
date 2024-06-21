import { Editor } from "slate";
import { ReactEditor } from "slate-react";
import { useDraggable } from "@dnd-kit/core";
import { PropsWithChildren } from "react";
import { ButtonElement } from "types/slate";
import { Card } from "components/atoms/card";

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
      <button
        disabled
        className="border-4 border-black rounded-sm py-4 px-12 pointer-events-none"
      />
    </Card>
  );
}

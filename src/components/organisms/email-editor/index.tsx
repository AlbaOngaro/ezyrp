import React, { useState } from "react";
import { Editor, createEditor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  useSlateStatic,
  ReactEditor,
} from "slate-react";
import { useDraggable, DndContext } from "@dnd-kit/core";

import { useRenderElement } from "./hooks/useRenderElement";

import { withImages } from "./plugins/withImages";
import { withHr } from "./plugins/withHr";
import { withIds } from "./plugins/withIds";

import { useOnKeyDown } from "./hooks/useOnKeyDown";
import { useOnValueChange } from "./hooks/useOnValueChange";
import { Container } from "./components";
import { useOnDragEnd } from "./hooks/useOnDragEnd";
import { Doc } from "convex/_generated/dataModel";
import { H4 } from "components/atoms/typography";
import { ButtonElement } from "types/slate";

type Props = {
  email: Doc<"emails">;
  readOnly?: boolean;
};

function Button({
  children,
  editor,
}: {
  children?: React.ReactNode;
  editor: Editor;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "button",
    disabled: ReactEditor.isReadOnly(editor),
    data: {
      id: "",
      type: "button",
      href: "",
      children: [],
    } satisfies ButtonElement,
  });

  return (
    <button
      ref={setNodeRef}
      style={{
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

export function EmailEditor({ email, readOnly = false }: Props) {
  const [editor] = useState(() =>
    withHr(withImages(withIds(withReact(createEditor())))),
  );

  const onKeyDown = useOnKeyDown(editor);
  const onDragEnd = useOnDragEnd(editor);
  const renderElement = useRenderElement();
  const onValueChange = useOnValueChange(email._id);

  return (
    <div className="grid grid-cols-[1fr,300px] items-start h-full">
      <DndContext onDragEnd={onDragEnd}>
        <Slate
          editor={editor}
          initialValue={email.body}
          onValueChange={onValueChange}
        >
          <Editable
            className="focus-within:outline-none"
            renderElement={renderElement}
            onKeyDown={onKeyDown}
            readOnly={readOnly}
            as={Container}
          />
        </Slate>

        <aside className="border-l h-full p-4">
          <H4>Components</H4>

          <Button editor={editor}>Button</Button>
        </aside>
      </DndContext>
    </div>
  );
}

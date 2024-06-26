import React, { useState } from "react";
import { Descendant, Editor, createEditor } from "slate";
import { Slate, Editable as SlateEditable, withReact } from "slate-react";

import { useRenderElement } from "./hooks/useRenderElement";

import { withImages } from "./plugins/withImages";
import { withHr } from "./plugins/withHr";
import { withIds } from "./plugins/withIds";

import { useOnKeyDown } from "./hooks/useOnKeyDown";
import { useOnValueChange } from "./hooks/useOnValueChange";
import { Editable } from "./editable";
import { useRenderLeaf } from "./hooks/useRenderLeaf";
import { Doc, Id } from "convex/_generated/dataModel";
import { cn } from "lib/utils/cn";

type Props = {
  email: Doc<"emails">;
  readOnly?: boolean;
};

function ViewMode({
  editor,
  initialValue,
}: {
  editor: Editor;
  initialValue: Descendant[];
}) {
  const renderLeaf = useRenderLeaf();
  const renderElement = useRenderElement();
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <SlateEditable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        as={Editable}
        readOnly
      />
    </Slate>
  );
}

function EditMode({
  id,
  editor,
  initialValue,
}: {
  id: Id<"emails">;
  editor: Editor;
  initialValue: Descendant[];
}) {
  const onKeyDown = useOnKeyDown(editor);
  const renderLeaf = useRenderLeaf();
  const renderElement = useRenderElement();
  const onValueChange = useOnValueChange(id, {
    autoSave: true,
  });

  return (
    <div className={cn("grid items-start h-full grid-cols-[1fr,350px]")}>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onValueChange={onValueChange}
      >
        <SlateEditable
          className="focus-within:outline-none"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          as={Editable}
        />
      </Slate>

      <aside id="sidebar" className="border-l h-full pl-8" />
    </div>
  );
}

export function EmailEditor({ email, readOnly = false }: Props) {
  const [editor] = useState(() =>
    withHr(withImages(withIds(withReact(createEditor())))),
  );

  if (readOnly) {
    return <ViewMode editor={editor} initialValue={email.body} />;
  }

  return <EditMode id={email._id} editor={editor} initialValue={email.body} />;
}

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
import { withColumns } from "./plugins/wihtColumns";
import { withSections } from "./plugins/withSections";
import { withLinks } from "./plugins/withLinks";
import { EditorConfigProvider } from "./providers/config";
import { Doc, Id } from "convex/_generated/dataModel";
import { cn } from "lib/utils/cn";

type Props = {
  email: Doc<"emails">;
  readOnly?: boolean;
  placeholder?: string;
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
  placeholder,
  initialValue,
}: {
  id: Id<"emails">;
  editor: Editor;
  placeholder?: string;
  initialValue: Descendant[];
}) {
  const onKeyDown = useOnKeyDown(editor);
  const renderLeaf = useRenderLeaf();
  const renderElement = useRenderElement();
  const onValueChange = useOnValueChange(id, {
    autoSave: true,
  });

  return (
    <div className="grid items-start h-full grid-cols-3 bg-gray-50">
      <aside
        id="sidebar"
        className="h-full px-8 py-4 flex flex-col gap-4 bg-white"
      />

      <div className="col-span-2 h-full py-4 bg-transparent">
        <EditorConfigProvider placeholder={placeholder}>
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
        </EditorConfigProvider>
      </div>
    </div>
  );
}

export function EmailEditor({ email, placeholder, readOnly = false }: Props) {
  const [editor] = useState(() =>
    withLinks(
      withSections(
        withColumns(withHr(withImages(withIds(withReact(createEditor()))))),
      ),
    ),
  );

  if (readOnly) {
    return <ViewMode editor={editor} initialValue={email.body} />;
  }

  return (
    <EditMode
      id={email._id}
      editor={editor}
      initialValue={email.body}
      placeholder={placeholder}
    />
  );
}

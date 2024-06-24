import React, { useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable as SlateEditable, withReact } from "slate-react";

import { useRenderElement } from "./hooks/useRenderElement";

import { withImages } from "./plugins/withImages";
import { withHr } from "./plugins/withHr";
import { withIds } from "./plugins/withIds";

import { useOnKeyDown } from "./hooks/useOnKeyDown";
import { useOnValueChange } from "./hooks/useOnValueChange";
import { Editable } from "./editable";
import { Doc } from "convex/_generated/dataModel";

type Props = {
  email: Doc<"emails">;
  readOnly?: boolean;
};

export function EmailEditor({ email, readOnly = false }: Props) {
  const [editor] = useState(() =>
    withHr(withImages(withIds(withReact(createEditor())))),
  );

  const onKeyDown = useOnKeyDown(editor);
  const renderElement = useRenderElement();
  const onValueChange = useOnValueChange(email._id, {
    autoSave: true,
  });

  return (
    <div className="grid grid-cols-[1fr,350px] items-start h-full">
      <Slate
        editor={editor}
        initialValue={email.body}
        onValueChange={onValueChange}
      >
        <SlateEditable
          className="focus-within:outline-none"
          renderElement={renderElement}
          onKeyDown={onKeyDown}
          readOnly={readOnly}
          as={Editable}
        />
      </Slate>

      <aside id="sidebar" className="border-l h-full pl-8" />
    </div>
  );
}

import React, { useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

import { useRenderElement } from "./hooks/useRenderElement";

import { withImages } from "./plugins/withImages";
import { withHr } from "./plugins/withHr";
import { withIds } from "./plugins/withIds";

import { useOnKeyDown } from "./hooks/useOnKeyDown";
import { useOnValueChange } from "./hooks/useOnValueChange";
import { Container } from "./components";
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
  const onValueChange = useOnValueChange(email._id);

  return (
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
  );
}

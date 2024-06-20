import React, { useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { debounce } from "lodash";

import { useRenderElement } from "./hooks/useRenderElement";

import { withImages } from "./plugins/withImages";
import { withHr } from "./plugins/withHr";
import { withIds } from "./plugins/withIds";

import { initialValue } from "./constants";
import { useOnKeyDown } from "./hooks/useOnKeyDown";

export function EmailEditor() {
  const [editor] = useState(() =>
    withHr(withImages(withIds(withReact(createEditor())))),
  );

  const onKeyDown = useOnKeyDown(editor);
  const renderElement = useRenderElement();

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onValueChange={debounce((value) => console.log("onChange", value), 150)}
    >
      <Editable
        className="focus-within:outline-none"
        renderElement={renderElement}
        onKeyDown={onKeyDown}
      />
    </Slate>
  );
}

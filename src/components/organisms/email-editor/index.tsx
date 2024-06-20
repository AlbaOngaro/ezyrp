import React, { useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { initialValue } from "./constants";
import { withImages } from "./plugins/withImages";
import { withHr } from "./plugins/withHr";
import { useRenderElement } from "./hooks/useRenderElement";

export function EmailEditor() {
  const [editor] = useState(() =>
    withHr(withImages(withReact(createEditor()))),
  );

  const renderElement = useRenderElement();

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => console.log("onChange", value)}
    >
      <Editable
        className="focus-within:outline-none"
        renderElement={renderElement}
      />
    </Slate>
  );
}

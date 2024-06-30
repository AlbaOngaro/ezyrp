import React, { forwardRef, useEffect, useState } from "react";
import {
  Slate,
  Editable as SlateEditable,
  useSlate,
  withReact,
} from "slate-react";
import { createEditor, Descendant, Location, Path, Transforms } from "slate";

import { withHr } from "../../plugins/withHr";
import { withImages } from "../../plugins/withImages";
import { withIds } from "../../plugins/withIds";

import { useRenderElement } from "../../hooks/useRenderElement";
import { useRenderLeaf } from "../../hooks/useRenderLeaf";
import { useOnKeyDown } from "../../hooks/useOnKeyDown";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { withActionHandlers } from "../../hocs/withActionHandlers";

import { EditorConfigProvider } from "../../providers/config";
import { isColumnElementArray, Props } from "./types";
import { Editable } from "./editable";
import { ColumnsWidthEditableFields } from "./editable-fields";
import { mergeRefs } from "lib/utils/mergeRefs";
import { cn } from "lib/utils/cn";

const Row = forwardRef<any, Props>(function Row(
  { element, attributes: { ref: slateRef, ...slateAttributes }, children },
  ref,
) {
  const { style, columns: initialValue } = element;
  const parent = useSlate();
  const path = useGetSlatePath(element);
  const [editor] = useState(() =>
    withHr(withImages(withIds(withReact(createEditor())))),
  );

  const renderElement = useRenderElement();
  const renderLeaf = useRenderLeaf();
  const onKeyDown = useOnKeyDown(editor);

  const onValueChange = (descendants: Descendant[]) => {
    if (isColumnElementArray(descendants)) {
      Transforms.setNodes(parent, { columns: descendants }, { at: path });
    }
  };

  useEffect(() => {
    const selection = parent.selection;
    if (
      !Location.isLocation(selection) ||
      (Location.isLocation(selection) &&
        !Path.isCommon(path, selection.anchor.path))
    ) {
      Transforms.deselect(editor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parent.selection]);

  return (
    <table
      align="center"
      width="100%"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={style}
      ref={ref}
      className={cn(
        "element hover:bg-green-50 hover:outline hover:outline-2 hover:outline-green-300",
      )}
    >
      <tbody
        style={{ width: "100%" }}
        contentEditable={false}
        {...slateAttributes}
        ref={mergeRefs(slateRef, ref)}
      >
        {children}
        <EditorConfigProvider dnd={false} toolbar={false}>
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
              onFocus={() => Transforms.select(parent, path)}
              as={Editable}
            />
          </Slate>
        </EditorConfigProvider>
      </tbody>
    </table>
  );
});

const EnhancedRow = withActionHandlers(Row, {
  editableFields: {
    width: {
      type: "custom",
      render: (props) => <ColumnsWidthEditableFields {...props} />,
    },
  },
});

export { EnhancedRow as Row };

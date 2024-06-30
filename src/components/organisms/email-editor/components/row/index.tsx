import React, { forwardRef, useRef, useState } from "react";
import {
  ReactEditor,
  Slate,
  Editable as SlateEditable,
  useSlate,
  withReact,
} from "slate-react";
import { createEditor, Descendant, Location, Transforms } from "slate";

import { withHr } from "../../plugins/withHr";
import { withImages } from "../../plugins/withImages";
import { withIds } from "../../plugins/withIds";

import { useRenderElement } from "../../hooks/useRenderElement";
import { useRenderLeaf } from "../../hooks/useRenderLeaf";
import { useOnKeyDown } from "../../hooks/useOnKeyDown";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { withActionHandlers } from "../../hocs/withActionHandlers";

import { EditorConfigProvider } from "../../providers/config";
import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import { isColumnElementArray, Props } from "./types";
import { Editable } from "./editable";
import { cn } from "lib/utils/cn";
import { useClickOutsideRect } from "hooks/useClickOutsideRect";

const Row = forwardRef<any, Props>(function Row(
  { element, attributes, children },
  ref,
) {
  const { style, columns: initialValue } = element;
  const parent = useSlate();
  const path = useGetSlatePath(element);
  const [editor] = useState(() =>
    withHr(withImages(withIds(withReact(createEditor())))),
  );
  const tbody = useRef<HTMLTableSectionElement | null>(null);
  const isSelected = useGetIsSelected(element, {
    exact: true,
  });

  const renderElement = useRenderElement();
  const renderLeaf = useRenderLeaf();
  const onKeyDown = useOnKeyDown(editor);

  useClickOutsideRect(tbody, (e) => {
    if (!e.defaultPrevented) {
      editor.deselect();
    }
  });

  const onValueChange = (descendants: Descendant[]) => {
    if (isColumnElementArray(descendants)) {
      Transforms.setNodes(parent, { columns: descendants }, { at: path });
    }
  };

  if (ReactEditor.isReadOnly(parent)) {
    return (
      <table
        align="center"
        width="100%"
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={style}
      >
        <tbody style={{ width: "100%" }}>
          <Slate editor={editor} initialValue={initialValue}>
            <SlateEditable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              readOnly
              as="tr"
            />
          </Slate>
        </tbody>
      </table>
    );
  }

  return (
    <div
      contentEditable={false}
      className={cn(
        "element relative w-[calc(100%+4rem)] -ml-8 px-8 py-4",
        "[&:not(:has(.element:hover))]:hover:bg-green-50 [&:not(:has(.element:hover))]:hover:outline [&:not(:has(.element:hover))]:hover:outline-green-300",
        "[&:not(:has(.element:hover)):hover>table]:outline [&:not(:has(.element:hover)):hover>table]:outline-green-200",
        {
          "hover:bg-transparent outline outline-2 outline-green-300":
            isSelected,
        },
      )}
      {...attributes}
    >
      {children}
      <table
        align="center"
        width="100%"
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={style}
        ref={ref}
      >
        <tbody style={{ width: "100%" }} ref={tbody}>
          <EditorConfigProvider dnd={false}>
            <Slate
              editor={editor}
              initialValue={initialValue}
              onValueChange={onValueChange}
              onSelectionChange={(selection) => {
                if (Location.isLocation(selection)) {
                  parent.deselect();
                }
              }}
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
    </div>
  );
});

const EnhancedRow = withActionHandlers(Row);

export { EnhancedRow as Row };

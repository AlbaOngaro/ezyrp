import React, { forwardRef, useEffect, useState } from "react";
import {
  RenderElementProps,
  Slate,
  Editable as SlateEditable,
  useSlate,
  useSlateStatic,
  withReact,
} from "slate-react";
import {
  createEditor,
  Descendant,
  Location,
  Path,
  Transforms,
  Element,
} from "slate";
import { EditableProps } from "slate-react/dist/components/editable";
import { debounce } from "lodash";

import { withHr } from "../../plugins/withHr";
import { withImages } from "../../plugins/withImages";
import { withIds } from "../../plugins/withIds";

import { useRenderElement } from "../../hooks/useRenderElement";
import { useRenderLeaf } from "../../hooks/useRenderLeaf";
import { useOnKeyDown } from "../../hooks/useOnKeyDown";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { withActionHandlers } from "../../hocs/withActionHandlers";

import { EditorConfigProvider } from "../../context";

import { ColumnElement, RowElement } from "types/slate";
import { mergeRefs } from "lib/utils/mergeRefs";
import { ResizablePanelGroup } from "components/atoms/resizable";

interface Props extends RenderElementProps {
  element: RowElement;
}

function isColumnElementArray(
  descendants: Descendant[],
): descendants is ColumnElement[] {
  return descendants.every(
    (descendant) =>
      Element.isElement(descendant) &&
      Element.isElementType(descendant, "column"),
  );
}

const Editable = forwardRef<any, EditableProps>(function Editable(
  { children, ...props },
  ref,
) {
  const editor = useSlateStatic();
  const onLayout = debounce((columns: number[]) => {
    columns.forEach((width, index) => {
      const path = [index];
      Transforms.setNodes(editor, { width }, { at: path });
    });
  }, 250);

  return (
    // @ts-ignore
    <tr {...props} ref={ref}>
      <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
        {children}
      </ResizablePanelGroup>
    </tr>
  );
});

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
    >
      <tbody
        style={{ width: "100%" }}
        contentEditable={false}
        {...slateAttributes}
        ref={mergeRefs(slateRef, ref)}
      >
        {children}
        <EditorConfigProvider dnd={false} actions={false} toolbar={false}>
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

const EnhancedRow = withActionHandlers(Row);

export { EnhancedRow as Row };

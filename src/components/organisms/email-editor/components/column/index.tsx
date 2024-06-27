import React, { forwardRef } from "react";
import { RenderElementProps, useSlateStatic } from "slate-react";
import { Editor } from "slate";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { mergeRefs } from "lib/utils/mergeRefs";
import { ColumnElement } from "types/slate";
import { ResizableHandle, ResizablePanel } from "components/atoms/resizable";

interface Props extends RenderElementProps {
  element: ColumnElement;
}

export const Column = forwardRef<HTMLTableDataCellElement, Props>(
  function Column(
    { element, children, attributes: { ref: slateRef, ...slateAttributes } },
    ref,
  ) {
    const { style, width } = element;
    const editor = useSlateStatic();
    const path = useGetSlatePath(element);

    const hasNextSibling = !!Editor.next(editor, { at: path });

    if (hasNextSibling) {
      return (
        <>
          <ResizablePanel
            ref={mergeRefs(slateRef, ref)}
            style={style}
            tagName="td"
            defaultSize={width}
            {...slateAttributes}
          >
            {children}
          </ResizablePanel>
          <ResizableHandle withHandle />
        </>
      );
    }

    return (
      <ResizablePanel
        ref={mergeRefs(slateRef, ref)}
        style={style}
        tagName="td"
        className="pl-4"
        defaultSize={width}
        {...slateAttributes}
      >
        {children}
      </ResizablePanel>
    );
  },
);

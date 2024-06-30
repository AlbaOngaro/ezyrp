import React, { forwardRef } from "react";
import { RenderElementProps, useSlateStatic } from "slate-react";
import { Editor } from "slate";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import { mergeRefs } from "lib/utils/mergeRefs";
import { ColumnElement } from "types/slate";
import { ResizableHandle, ResizablePanel } from "components/atoms/resizable";
import { cn } from "lib/utils/cn";

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

    const isSelected = useGetIsSelected(element);

    const hasNextSibling = !!Editor.next(editor, { at: path });

    return (
      <>
        <ResizablePanel
          className={cn(
            "px-8",
            "element hover:bg-green-50 hover:outline hover:outline-2 hover:outline-green-300",
            {
              "hover:bg-transparent outline outline-2 outline-green-300":
                isSelected,
            },
          )}
          ref={mergeRefs(slateRef, ref)}
          style={style}
          tagName="td"
          defaultSize={width}
          {...slateAttributes}
        >
          {children}
        </ResizablePanel>
        {hasNextSibling && <ResizableHandle withHandle />}
      </>
    );
  },
);

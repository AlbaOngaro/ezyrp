import React, { forwardRef } from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { Editor } from "slate";

import { withActionHandlers } from "../../hocs/withActionHandlers";
import { withToolbar } from "../../hocs/withToolbar";
import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import { withInsertPreview } from "../../hocs/withInsertPreview";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { useEditorConfig } from "../../providers/config";
import { renderToolbar } from "./toolbar";
import { mergeRefs } from "lib/utils/mergeRefs";
import { ParagraphElement } from "types/slate";
import { cn } from "lib/utils/cn";

interface Props extends RenderElementProps {
  element: ParagraphElement;
}

const Text = forwardRef<HTMLParagraphElement, Props>(function Text(
  {
    element,
    attributes: { ref: slateRef, ...slateAttributes },
    children,
    ...rest
  },
  ref,
) {
  const { style } = element;
  const editor = useSlateStatic();
  const path = useGetSlatePath(element);
  const { placeholder } = useEditorConfig();
  const isSelected = useGetIsSelected(element, {
    exact: true,
  });

  if (ReactEditor.isReadOnly(editor)) {
    return (
      <p
        style={{
          fontSize: "14px",
          lineHeight: "24px",
          margin: "16px 0",
          cursor: "text",
          ...(style || {}),
        }}
      >
        {children}
      </p>
    );
  }

  const content = Editor.string(editor, path);
  const isEmpty = Editor.hasTexts(editor, element) && !content;

  return (
    <p
      className={cn(
        "element hover:bg-green-50 hover:outline hover:outline-2 hover:outline-green-300",
        {
          "relative after:text-gray-300 after:absolute after:top-0 after:w-full after:content-[var(--placeholder)]":
            isEmpty,
          "hover:bg-transparent outline outline-2 outline-green-300":
            isSelected,
        },
      )}
      style={{
        // @ts-ignore
        "--placeholder": `"${placeholder}"`,
        fontSize: "14px",
        lineHeight: "24px",
        margin: "16px 0",
        cursor: "text",
        ...(style || {}),
      }}
      ref={mergeRefs(ref, slateRef)}
      {...slateAttributes}
      {...rest}
    >
      {children}
    </p>
  );
});

const EnhancedText = withInsertPreview(
  withActionHandlers(
    withToolbar(Text, {
      renderToolbar,
    }),
  ),
);

export { EnhancedText as Text };

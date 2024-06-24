import React, { forwardRef } from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";

import { withActionHandlers } from "../../hocs/withActionHandlers";
import { withToolbar } from "../../hocs/withToolbar";
import { useGetIsSelected } from "../../hooks/useGetIsSelected";
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
  const isSelected = useGetIsSelected(element);

  if (ReactEditor.isReadOnly(editor)) {
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
    </p>;
  }

  return (
    <p
      className={cn({
        "outline outline-offset-2 outline-blue-500 outline-2 rounded-[1px]":
          isSelected,
      })}
      style={{
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

const EnhancedText = withToolbar(withActionHandlers(Text), {
  renderToolbar,
});

export { EnhancedText as Text };

import React, { forwardRef } from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";

import { withDndHandlers } from "../../hocs/withDndHandlers";
import { mergeRefs } from "lib/utils/mergeRefs";
import { ParagraphElement } from "types/slate";

interface Props extends RenderElementProps {
  element: ParagraphElement;
}

const Text = forwardRef<HTMLParagraphElement, Props>(function Text(
  {
    attributes: { ref: slateRef, ...slateAttributes },
    element: { style },
    children,
    ...rest
  },
  ref,
) {
  const editor = useSlateStatic();

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

const EnhancedText = withDndHandlers(Text);

export { EnhancedText as Text };

import React, { forwardRef } from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { withActionHandlers } from "../../hocs/withActionHandlers";
import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import { HrElement } from "types/slate";

import { mergeRefs } from "lib/utils/mergeRefs";
import { cn } from "lib/utils/cn";

interface Props extends RenderElementProps {
  element: HrElement;
}

const Hr = forwardRef<HTMLHRElement, Props>(function Hr(
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
    return (
      <hr
        style={{
          width: "100%",
          border: "none",
          borderTop: "1px solid #eaeaea",
          ...style,
        }}
      />
    );
  }

  return (
    <div
      className={cn("py-4", {
        "outline outline-offset-2 outline-blue-500 outline-2 rounded-[1px]":
          isSelected,
      })}
      contentEditable={false}
      ref={mergeRefs(ref, slateRef)}
      {...slateAttributes}
      {...rest}
    >
      <hr
        style={{
          width: "100%",
          border: "none",
          borderTop: "1px solid #eaeaea",
          ...style,
        }}
      />
      {children}
    </div>
  );
});

const EnhancedHr = withActionHandlers(Hr);

export { EnhancedHr as Hr };

import React, { forwardRef } from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { withActionHandlers } from "../../hocs/withActionHandlers";
import { HrElement } from "types/slate";

import { mergeRefs } from "lib/utils/mergeRefs";

interface Props extends RenderElementProps {
  element: HrElement;
}

const Hr = forwardRef<HTMLHRElement, Props>(function Hr(
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

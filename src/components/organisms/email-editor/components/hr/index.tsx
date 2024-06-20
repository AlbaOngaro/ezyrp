import React, { forwardRef } from "react";
import { RenderElementProps } from "slate-react";
import { withDndHandlers } from "../../hocs/withDndHandlers";
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

const EnhancedHr = withDndHandlers(Hr);

export { EnhancedHr as Hr };

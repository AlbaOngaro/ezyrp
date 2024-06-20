import React, { forwardRef } from "react";
import { RenderElementProps } from "slate-react";

import { withDndHandlers } from "../../hocs/withDndHandlers";
import { mergeRefs } from "lib/utils/mergeRefs";
import { ImgElement } from "types/slate";

interface Props extends RenderElementProps {
  element: ImgElement;
}

const Img = forwardRef<HTMLImageElement, Props>(function Img(
  {
    attributes: { ref: slateRef, ...slateAttributes },
    element: { src, alt, style },
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
      <img
        alt={alt}
        src={src}
        style={{
          display: "block",
          outline: "none",
          border: "none",
          textDecoration: "none",
          ...(style || {}),
        }}
      />
      {children}
    </div>
  );
});

const EnhancedImg = withDndHandlers(Img);

export { EnhancedImg as Img };

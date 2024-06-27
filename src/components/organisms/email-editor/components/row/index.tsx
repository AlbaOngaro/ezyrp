import React, { forwardRef } from "react";
import { RenderElementProps } from "slate-react";
import { mergeRefs } from "lib/utils/mergeRefs";
import { RowElement } from "types/slate";

interface Props extends RenderElementProps {
  element: RowElement;
}

export const Row = forwardRef<HTMLTableElement, Props>(function Row(
  {
    children,
    element: { style },
    attributes: { ref: slateRef, ...slateAttributes },
  },
  ref,
) {
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
      <tbody style={{ width: "100%" }}>
        <tr
          style={{ width: "100%", height: "4rem" }}
          ref={slateRef}
          {...slateAttributes}
        >
          {children}
        </tr>
      </tbody>
    </table>
  );
});

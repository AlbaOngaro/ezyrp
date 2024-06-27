import React, { forwardRef } from "react";
import { RenderElementProps } from "slate-react";
import { mergeRefs } from "lib/utils/mergeRefs";
import { ColumnElement } from "types/slate";

interface Props extends RenderElementProps {
  element: ColumnElement;
}

export const Column = forwardRef<HTMLTableDataCellElement, Props>(
  function Column(
    {
      children,
      element: { style },
      attributes: { ref: slateRef, ...slateAttributes },
    },
    ref,
  ) {
    return (
      <td
        data-id="__react-email-column"
        ref={mergeRefs(slateRef, ref)}
        style={style}
        {...slateAttributes}
      >
        {children}
      </td>
    );
  },
);

import React, { forwardRef } from "react";

type RootProps = React.ComponentPropsWithoutRef<"td">;

export type ColumnProps = RootProps;

export const Column = forwardRef<HTMLTableDataCellElement, ColumnProps>(
  function Column({ children, style, ...props }, ref) {
    return (
      <td {...props} data-id="__react-email-column" ref={ref} style={style}>
        {children}
      </td>
    );
  },
);

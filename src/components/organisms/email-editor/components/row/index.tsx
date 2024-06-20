import React, { forwardRef } from "react";

type RootProps = React.ComponentPropsWithoutRef<"table">;

export interface RowProps extends RootProps {
  children: React.ReactNode;
}

export const Row = forwardRef<HTMLTableElement, RowProps>(function Row(
  { children, style, ...props },
  ref,
) {
  return (
    <table
      align="center"
      width="100%"
      {...props}
      border={0}
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={style}
      ref={ref}
    >
      <tbody style={{ width: "100%" }}>
        <tr style={{ width: "100%" }}>{children}</tr>
      </tbody>
    </table>
  );
});

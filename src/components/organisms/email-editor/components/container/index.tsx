import React, { forwardRef } from "react";

type RootProps = React.ComponentPropsWithoutRef<"table">;

export type ContainerProps = RootProps;

export const Container = forwardRef<HTMLTableElement, ContainerProps>(
  function Container({ children, style, ...props }, ref) {
    return (
      <table
        align="center"
        width="100%"
        {...props}
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={{ maxWidth: "37.5em", ...style }}
        ref={ref}
      >
        <tbody>
          <tr style={{ width: "100%" }}>
            <td>{children}</td>
          </tr>
        </tbody>
      </table>
    );
  },
);

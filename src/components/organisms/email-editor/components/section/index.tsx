import React, { forwardRef } from "react";

type RootProps = React.ComponentPropsWithoutRef<"table">;

export type SectionProps = RootProps;

export const Section = forwardRef<HTMLTableElement, SectionProps>(
  function Section({ children, style, ...props }, ref) {
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
        <tbody>
          <tr>
            <td>{children}</td>
          </tr>
        </tbody>
      </table>
    );
  },
);

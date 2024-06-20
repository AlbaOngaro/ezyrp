import React, { forwardRef } from "react";

type RootProps = React.ComponentPropsWithoutRef<"hr">;

export type HrProps = RootProps;

export const Hr = forwardRef<HTMLHRElement, HrProps>(function Hr(
  { style, ...props },
  ref,
) {
  return (
    <hr
      {...props}
      style={{
        width: "100%",
        border: "none",
        borderTop: "1px solid #eaeaea",
        ...style,
      }}
      ref={ref}
    />
  );
});

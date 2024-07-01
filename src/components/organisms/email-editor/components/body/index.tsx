import React from "react";

type RootProps = React.ComponentPropsWithoutRef<"body">;

export type BodyProps = RootProps;

export const Body = React.forwardRef<HTMLBodyElement, Readonly<BodyProps>>(
  ({ children, style, ...props }, ref) => {
    return (
      <body {...props} style={style} ref={ref}>
        {children}
      </body>
    );
  },
);

Body.displayName = "Body";

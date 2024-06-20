import React, { forwardRef } from "react";

type RootProps = React.ComponentPropsWithoutRef<"head">;

export type HeadProps = RootProps;

export const Head = forwardRef<HTMLHeadElement, HeadProps>(function Head(
  { children, ...props },
  ref,
) {
  return (
    // eslint-disable-next-line
    <head {...props} ref={ref}>
      <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
      <meta name="x-apple-disable-message-reformatting" />
      {children}
    </head>
  );
});

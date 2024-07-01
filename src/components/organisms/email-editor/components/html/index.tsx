import React, { forwardRef } from "react";

type RootProps = React.ComponentPropsWithoutRef<"html">;

export type HtmlProps = RootProps;

export const Html = forwardRef<HTMLHtmlElement, HtmlProps>(function Html(
  { children, lang = "en", dir = "ltr", ...props },
  ref,
) {
  return (
    <html {...props} dir={dir} lang={lang} ref={ref}>
      {children}
    </html>
  );
});

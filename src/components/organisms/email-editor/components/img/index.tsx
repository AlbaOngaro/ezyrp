import React, { forwardRef } from "react";

type RootProps = React.ComponentPropsWithoutRef<"img">;

export type ImgProps = RootProps;

export const Img = forwardRef<HTMLImageElement, ImgProps>(function Img(
  { alt, src, width, height, style, ...props },
  ref,
) {
  return (
    <img
      {...props}
      alt={alt}
      height={height}
      src={src}
      style={{
        display: "block",
        outline: "none",
        border: "none",
        textDecoration: "none",
        ...style,
      }}
      width={width}
      ref={ref}
    />
  );
});

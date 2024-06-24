import React, { forwardRef } from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";

import { withActionHandlers } from "../../hocs/withActionHandlers";
import { parsePadding, pxToPt } from "./utils";

import { mergeRefs } from "lib/utils/mergeRefs";
import { ButtonElement } from "types/slate";

interface Props extends RenderElementProps {
  element: ButtonElement;
}

const buttonStyle = (
  style?: React.CSSProperties & {
    pt: number;
    pr: number;
    pb: number;
    pl: number;
  },
) => {
  const { pt, pr, pb, pl, ...rest } = style || {};

  return {
    lineHeight: "100%",
    textDecoration: "none",
    display: "inline-block",
    maxWidth: "100%",
    ...rest,
    padding: `${pt}px ${pr}px ${pb}px ${pl}px`,
  };
};

const buttonTextStyle = (pb?: number) => {
  return {
    maxWidth: "100%",
    display: "inline-block",
    lineHeight: "120%",
    msoPaddingAlt: "0px",
    msoTextRaise: pxToPt(pb || 0),
  };
};

const Button = forwardRef<HTMLAnchorElement, Props>(function Button(
  {
    children,
    attributes: { ref: slateRef, ...slateAttributes },
    element: { style, href, target = "_blank" },
    ...rest
  },
  ref,
) {
  const editor = useSlateStatic();
  const { pt, pr, pb, pl } = parsePadding({
    padding: style?.padding,
    paddingLeft: style?.paddingLeft,
    paddingRight: style?.paddingRight,
    paddingTop: style?.paddingTop,
    paddingBottom: style?.paddingBottom,
  });

  const y = pt + pb;
  const textRaise = pxToPt(y);

  if (ReactEditor.isReadOnly(editor)) {
    return (
      <a
        href={href}
        style={buttonStyle({
          ...(style || {}),
          pt,
          pr,
          pb,
          pl,
        })}
        target={target}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso]><i style="letter-spacing: ${pl}px;mso-font-width:-100%;mso-text-raise:${textRaise}" hidden>&nbsp;</i><![endif]-->`,
          }}
        />
        <span style={buttonTextStyle(pb)}>{children}</span>
        <span
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso]><i style="letter-spacing: ${pr}px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]-->`,
          }}
        />
      </a>
    );
  }

  return (
    <a
      href={href}
      style={buttonStyle({
        ...(style || {}),
        pt,
        pr,
        pb,
        pl,
      })}
      target={target}
      ref={mergeRefs(ref, slateRef)}
      {...slateAttributes}
      {...rest}
    >
      <span
        dangerouslySetInnerHTML={{
          __html: `<!--[if mso]><i style="letter-spacing: ${pl}px;mso-font-width:-100%;mso-text-raise:${textRaise}" hidden>&nbsp;</i><![endif]-->`,
        }}
      />
      <span style={buttonTextStyle(pb)}>{children}</span>
      <span
        dangerouslySetInnerHTML={{
          __html: `<!--[if mso]><i style="letter-spacing: ${pr}px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]-->`,
        }}
      />
    </a>
  );
});

const EnhancedButton = withActionHandlers(Button, {
  editableFields: {
    padding: {
      label: "Padding",
      type: "number",
      defaultValue: 12,
    },
    borderRadius: {
      label: "Border Radius",
      type: "number",
      defaultValue: 4,
    },
    fontSize: {
      label: "Font Size",
      type: "number",
      defaultValue: 16,
    },
    backgroundColor: {
      label: "Background Color",
      type: "color",
      defaultValue: "#000000",
    },
    color: {
      label: "Color",
      type: "color",
      defaultValue: "#fff",
    },
  },
});

export { EnhancedButton as Button };

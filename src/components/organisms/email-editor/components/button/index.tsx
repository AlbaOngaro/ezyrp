import React, { forwardRef } from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";

import { withActionHandlers } from "../../hocs/withActionHandlers";
import { withToolbar } from "../../hocs/withToolbar";
import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import { parsePadding, pxToPt } from "./utils";
import { buttonStyle, buttonTextStyle } from "./styles";

import { renderToolbar } from "./toolbar";
import { mergeRefs } from "lib/utils/mergeRefs";
import { ButtonElement } from "types/slate";
import { cn } from "lib/utils/cn";

interface Props extends RenderElementProps {
  element: ButtonElement;
}

const Button = forwardRef<HTMLAnchorElement, Props>(function Button(
  {
    children,
    element,
    attributes: { ref: slateRef, ...slateAttributes },
    ...rest
  },
  ref,
) {
  const editor = useSlateStatic();
  const isSelected = useGetIsSelected(element);

  const { style, href, target = "_blank" } = element;
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
      className={cn(
        "element hover:bg-green-50 hover:outline hover:outline-2 hover:outline-green-300",
        {
          "hover:bg-transparent outline outline-2 outline-green-300":
            isSelected,
        },
      )}
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

const EnhancedButton = withToolbar(
  withActionHandlers(Button, {
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
      backgroundColor: {
        label: "Background Color",
        type: "color",
        defaultValue: "#000000",
      },
    },
  }),
  {
    renderToolbar,
  },
);

export { EnhancedButton as Button };

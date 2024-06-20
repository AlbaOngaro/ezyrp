import React, { useCallback, useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";

import { Html, Text, Button } from "./components";

const initialValue = [
  {
    type: "html" as const,
    children: [
      {
        type: "paragraph" as const,
        children: [{ text: "Hello World" }],
      },
    ],
  },
];

const HtmlElement = ({
  attributes: { ref, ...attributes },
  children,
}: RenderElementProps) => {
  return (
    <Html ref={ref} {...attributes}>
      {children}
    </Html>
  );
};

const ButtonElement = ({
  attributes: { ref, ...attributes },
  children,
}: RenderElementProps) => {
  return (
    <Button ref={ref} {...attributes}>
      {children}
    </Button>
  );
};

const DefaultElement = ({
  children,
  attributes: { ref, ...attributes },
}: RenderElementProps) => {
  return (
    <Text ref={ref} {...attributes}>
      {children}
    </Text>
  );
};

export function EmailEditor() {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "html":
        return <HtmlElement {...props} />;
      case "button":
        return <ButtonElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable renderElement={renderElement} />
    </Slate>
  );
}

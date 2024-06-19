import React, { useCallback, useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";

const initialValue = [
  {
    type: "paragraph" as const,
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const CodeElement = (props: RenderElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};

export function EmailEditor() {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
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

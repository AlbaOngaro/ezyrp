import React, { useCallback, useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";

import {
  Text,
  Button,
  Column,
  Container,
  Heading,
  Hr,
  Img,
  Link,
  Row,
  Section,
} from "./components";
import { initialValue } from "./constants";

export function EmailEditor() {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback(
    ({ attributes, element, children }: RenderElementProps) => {
      switch (element.type) {
        case "button":
          return (
            <Button {...attributes} {...element}>
              {children}
            </Button>
          );
        case "column":
          return (
            <Column {...attributes} {...element}>
              {children}
            </Column>
          );
        case "container":
          return (
            <Container {...attributes} {...element}>
              {children}
            </Container>
          );
        case "heading":
          return (
            <Heading {...attributes} {...element}>
              {children}
            </Heading>
          );
        case "hr":
          return (
            <Hr {...attributes} {...element}>
              {children}
            </Hr>
          );
        case "img":
          return (
            <Img {...attributes} {...element}>
              {children}
            </Img>
          );
        case "link":
          return (
            <Link {...attributes} {...element}>
              {children}
            </Link>
          );
        case "row":
          return (
            <Row {...attributes} {...element}>
              {children}
            </Row>
          );
        case "section":
          return (
            <Section {...attributes} {...element}>
              {children}
            </Section>
          );
        default:
          return (
            <Text {...attributes} {...element}>
              {children}
            </Text>
          );
      }
    },
    [],
  );

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable renderElement={renderElement} />
    </Slate>
  );
}

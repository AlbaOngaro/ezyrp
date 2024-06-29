import { useCallback } from "react";
import { RenderElementProps } from "slate-react";

import {
  Text,
  Button,
  Column,
  Heading,
  Hr,
  Img,
  Link,
  Row,
} from "../components";
import { Section } from "../components/section";

export function useRenderElement() {
  return useCallback(
    ({ attributes, element, children }: RenderElementProps) => {
      switch (element.type) {
        case "button":
          return (
            <Button attributes={attributes} element={element}>
              {children}
            </Button>
          );
        case "column":
          return (
            <Column attributes={attributes} element={element}>
              {children}
            </Column>
          );
        case "hr":
          return (
            <Hr attributes={attributes} element={element}>
              {children}
            </Hr>
          );
        case "img":
          return (
            <Img attributes={attributes} element={element}>
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
            <Row attributes={attributes} element={element}>
              {children}
            </Row>
          );
        case "heading": {
          return (
            <Heading attributes={attributes} element={element}>
              {children}
            </Heading>
          );
        }
        case "section": {
          return (
            <Section attributes={attributes} element={element}>
              {children}
            </Section>
          );
        }
        default:
          return (
            <Text attributes={attributes} element={element}>
              {children}
            </Text>
          );
      }
    },
    [],
  );
}

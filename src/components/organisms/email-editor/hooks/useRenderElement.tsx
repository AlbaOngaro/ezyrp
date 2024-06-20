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
            <Column {...attributes} {...element}>
              {children}
            </Column>
          );
        case "heading":
          return (
            <Heading {...attributes} {...element}>
              {children}
            </Heading>
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
            <Row {...attributes} {...element}>
              {children}
            </Row>
          );
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

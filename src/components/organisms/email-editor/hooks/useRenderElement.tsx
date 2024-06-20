import { useCallback } from "react";
import { RenderElementProps } from "slate-react";

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
        case "container":
          return (
            <Container attributes={attributes} element={element}>
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
            <div {...attributes}>
              <Hr />
              {children}
            </div>
          );
        case "img":
          return (
            <div {...attributes}>
              <Img src={element.src} />
              {children}
            </div>
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
}

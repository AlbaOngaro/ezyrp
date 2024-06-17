import { graphql } from "__generated__";

export const EVENT_TYPE = graphql(`
  query eventType($id: ID!) {
    eventType(id: $id) {
      id
      name
      description
      variant
      duration
    }
  }
`);

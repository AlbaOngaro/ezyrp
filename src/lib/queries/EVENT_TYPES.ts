import { graphql } from "__generated__";

export const EVENT_TYPES = graphql(`
  query eventTypes {
    eventTypes {
      id
      name
      variant
      duration
      description
    }
  }
`);

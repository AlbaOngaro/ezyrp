import { graphql } from "../../__generated__";

export const EVENTS = graphql(`
  query events {
    events {
      id
      start
      title
      variant
      notes
      end
      guests {
        id
        email
        name
      }
    }
  }
`);

import { graphql } from "../../__generated__";

export const EVENTS = graphql(`
  query events {
    events {
      id
      start
      end
      title
      guests {
        id
        email
        name
      }
    }
  }
`);

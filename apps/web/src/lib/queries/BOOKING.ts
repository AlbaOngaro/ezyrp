import { graphql } from "__generated__";

export const BOOKING = graphql(`
  query booking($id: ID!) {
    booking(id: $id) {
      event {
        id
        name
        description
        variant
        duration
      }
      settings {
        start
        end
        days
      }
    }
  }
`);

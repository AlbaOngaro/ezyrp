import { graphql } from "__generated__";

export const BOOKING = graphql(`
  query booking($id: ID!, $day: String!) {
    booking(id: $id, day: $day) {
      id
      days
      name
      slots
      duration
      description
    }
  }
`);

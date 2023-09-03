import { graphql } from "__generated__";

export const DELETE_EVENTS = graphql(`
  mutation deleteEvents($deleteEventsInput: [ID!]!) {
    deleteEvents(deleteEventsInput: $deleteEventsInput)
  }
`);

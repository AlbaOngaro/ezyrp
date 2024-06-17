import { graphql } from "__generated__";

export const DELETE_EVENT_TYPES = graphql(`
  mutation deleteEventTypes($ids: [ID!]!) {
    deleteEventTypes(ids: $ids)
  }
`);

import { graphql } from "__generated__";

export const CREATE_EVENT_TYPES = graphql(`
  mutation createEventTypes(
    $createEventTypesInput: [InputCreateEventTypeArgs!]!
  ) {
    createEventTypes(createEventTypesInput: $createEventTypesInput) {
      id
      name
      variant
      description
    }
  }
`);

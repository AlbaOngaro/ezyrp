import { graphql } from "__generated__";

export const UPDATE_EVENT_TYPES = graphql(`
  mutation updateEventTypes(
    $updateEventTypesInput: [InputUpdateEventTypeArgs!]!
  ) {
    updateEventTypes(updateEventTypesInput: $updateEventTypesInput) {
      id
      name
      description
      variant
      duration
    }
  }
`);

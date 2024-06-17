import { graphql } from "../../__generated__";

export const UPDATE_EVENTS = graphql(`
  mutation updateEvents($updateEventsInput: [InputUpdateEventsArgs!]!) {
    updateEvents(updateEventsInput: $updateEventsInput) {
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

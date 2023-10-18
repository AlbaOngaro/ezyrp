import { graphql } from "../../__generated__";

export const CREATE_EVENTS = graphql(`
  mutation createEvents($createEventsInput: [InputCreateEventArgs!]!) {
    createEvents(createEventsInput: $createEventsInput) {
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

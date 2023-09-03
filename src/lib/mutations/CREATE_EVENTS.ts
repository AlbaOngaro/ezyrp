import { graphql } from "__generated__";

export const CREATE_EVENTS = graphql(`
  mutation createEvents($createEventsInput: [InputCreateEventsArgs!]!) {
    createEvents(createEventsInput: $createEventsInput) {
      id
      start
      end
      title
      variant
      guests {
        id
        email
        name
        phone
      }
    }
  }
`);

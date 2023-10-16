import { graphql } from "__generated__";

export const BOOK_EVENT = graphql(`
  mutation bookEvent($bookEventInput: BookEventInput!) {
    bookEvent(bookEventInput: $bookEventInput) {
      id
      end
      start
      title
      notes
      variant
      guests {
        id
        email
        name
      }
    }
  }
`);

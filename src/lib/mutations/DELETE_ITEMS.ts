import { graphql } from "__generated__";

export const DELETE_ITEMS = graphql(`
  mutation deleteItems($deleteItemsInput: [ID!]!) {
    deleteItems(deleteItemsInput: $deleteItemsInput)
  }
`);

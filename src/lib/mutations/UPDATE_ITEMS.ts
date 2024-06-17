import { graphql } from "__generated__";

export const UPDATE_ITEMS = graphql(`
  mutation updateItems($updateItemsInput: [InputUpdateItems!]!) {
    updateItems(updateItemsInput: $updateItemsInput) {
      id
      name
      description
      price
      quantity
    }
  }
`);

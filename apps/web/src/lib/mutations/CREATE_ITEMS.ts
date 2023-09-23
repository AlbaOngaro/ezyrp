import { graphql } from "../../__generated__";

export const CREATE_ITEMS = graphql(`
  mutation createItems($createItemsInput: [InputCreateItems!]!) {
    createItems(createItemsInput: $createItemsInput) {
      id
      name
      description
      price
      quantity
    }
  }
`);

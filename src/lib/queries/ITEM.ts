import { graphql } from "../../__generated__";

export const ITEM = graphql(`
  query item($id: ID!) {
    item(id: $id) {
      id
      name
      quantity
      price
      description
    }
  }
`);

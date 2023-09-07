import { graphql } from "__generated__";

export const INVOICE = graphql(`
  query invoice($id: ID!) {
    invoice(id: $id) {
      id
      status
      description
      due
      emitted
      amount
      items {
        name
        price
        quantity
      }
      customer {
        id
        name
        email
      }
    }
  }
`);

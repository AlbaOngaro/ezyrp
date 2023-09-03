import { graphql } from "__generated__";

export const INVOICES = graphql(`
  query invoices {
    invoices {
      id
      customer {
        id
        email
        name
        phone
      }
      description
      status
      items {
        name
        quantity
        price
      }
      amount
      due
      emitted
    }
  }
`);

import { graphql } from "__generated__";

export const CUSTOMERS_WITH_LAST_INVOICE = graphql(`
  query customersWithLastInvoice {
    customers {
      id
      name
      email
      photoUrl
      lastInvoice {
        status
        amount
        emitted
      }
    }
  }
`);

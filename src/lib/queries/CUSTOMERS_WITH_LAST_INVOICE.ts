import { graphql } from "__generated__";

export const CUSTOMERS_WITH_LAST_INVOICE = graphql(`
  query customersWithLastInvoice {
    customers(filters: { limit: 3 }, orderBy: { lastInvoice: desc }) {
      results {
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
  }
`);

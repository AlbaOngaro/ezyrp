import { graphql } from "../../__generated__";

export const INVOICES = graphql(`
  query invoices($filters: InputInvoicesFilters) {
    invoices(filters: $filters) {
      total
      results {
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
          id
          name
          quantity
          price
        }
        amount
        due
        emitted
      }
    }
  }
`);

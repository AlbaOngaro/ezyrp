import { graphql } from "__generated__";

export const CUSTOMERS = graphql(`
  query getCustomers($filters: InputCustomersFilters = {}) {
    customers(filters: $filters) {
      hasNextPage
      results {
        id
        email
        name
        phone
        photoUrl
      }
    }
  }
`);

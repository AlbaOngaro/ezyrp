import { graphql } from "__generated__";

export const CUSTOMERS = graphql(/* GraphQL */ `
  query getCustomers($filters: InputCustomersFilters = {}) {
    customers(filters: $filters) {
      id
      email
      name
      phone
      photoUrl
    }
  }
`);

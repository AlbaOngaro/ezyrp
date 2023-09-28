import { graphql } from "__generated__";

export const CUSTOMER = graphql(`
  query getCustomer($id: ID!) {
    customer(id: $id) {
      id
      email
      name
      photoUrl
      address
      city
      code
      country
    }
  }
`);

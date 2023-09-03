import { graphql } from "__generated__";

export const DELETE_CUSTOMERS = graphql(`
  mutation deleteCustomers($deleteCustomerArgs: [ID!]!) {
    deleteCustomers(deleteCustomerArgs: $deleteCustomerArgs)
  }
`);

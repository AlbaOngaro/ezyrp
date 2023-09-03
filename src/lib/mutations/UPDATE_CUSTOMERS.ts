import { graphql } from "__generated__";

export const UPDATE_CUSTOMERS = graphql(`
  mutation updateCustomers($updateCustomerArgs: [InputUpdateCustomerArgs!]!) {
    updateCustomers(updateCustomerArgs: $updateCustomerArgs) {
      id
      email
      name
      phone
    }
  }
`);

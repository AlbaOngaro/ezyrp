import { graphql } from "../../__generated__";

export const CREATE_CUSTOMERS = graphql(`
  mutation createCustomers($createCustomerArgs: [InputCreateCustomerArgs!]!) {
    createCustomers(createCustomerArgs: $createCustomerArgs) {
      id
      email
      name
    }
  }
`);

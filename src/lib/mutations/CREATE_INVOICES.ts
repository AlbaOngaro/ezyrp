import { graphql } from "__generated__";

export const CREATE_INVOICES = graphql(`
  mutation createInvoices($createInvoicesArgs: [InputCreateInvoicesArgs!]!) {
    createInvoices(createInvoicesArgs: $createInvoicesArgs) {
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

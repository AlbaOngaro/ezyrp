import { graphql } from "__generated__";

export const UPDATE_INVOICES = graphql(`
  mutation updateInvoices($updateInvoicesArgs: [InputUpdateInvoicesArgs!]!) {
    updateInvoices(updateInvoicesArgs: $updateInvoicesArgs) {
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

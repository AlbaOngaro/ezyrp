import { graphql } from "__generated__";

export const DELETE_INVOICES = graphql(`
  mutation deleteInvoices($deleteInvoicesArgs: [ID!]!) {
    deleteInvoices(deleteInvoicesArgs: $deleteInvoicesArgs)
  }
`);

import { graphql } from "__generated__";

export const INVOICE = graphql(`
  query invoice($id: ID!) {
    invoice(id: $id) {
      id
    }
  }
`);

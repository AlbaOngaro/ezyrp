import { graphql } from "__generated__";

export const INVITES = graphql(`
  query invites {
    invites {
      id
      email
      sent_at
    }
  }
`);

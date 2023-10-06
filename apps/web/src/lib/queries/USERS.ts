import { graphql } from "__generated__";

export const USERS = graphql(`
  query users {
    users {
      id
      email
      username
      photoUrl
    }
  }
`);

import { graphql } from "__generated__";

export const USER = graphql(`
  query getUser {
    user {
      id
      username
      profile {
        address
        city
        country
        code
        name
      }
    }
  }
`);

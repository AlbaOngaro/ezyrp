import { graphql } from "__generated__";

export const USER = graphql(`
  query getUser {
    user {
      id
      email
      username
      profile {
        photoUrl
        address
        city
        country
        code
        name
      }
    }
  }
`);

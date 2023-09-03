import { graphql } from "__generated__";

export const LOGIN = graphql(`
  mutation login($credentials: InputLoginCredentials!) {
    login(credentials: $credentials) {
      id
      email
      password
      username
      profile {
        address
        city
        code
        country
        name
      }
    }
  }
`);

import { graphql } from "__generated__";

export const RESET_PASSWORD = graphql(`
  mutation resetPassword($credentials: InputResetPasswordCredentials!) {
    resetPassword(credentials: $credentials) {
      id
      email
      password
      username
      profile {
        photoUrl
        address
        city
        code
        country
        name
      }
    }
  }
`);

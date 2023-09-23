import { graphql } from "../../__generated__";

export const REGISTER = graphql(`
  mutation register($credentials: InputRegisterCredentials!) {
    register(credentials: $credentials) {
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

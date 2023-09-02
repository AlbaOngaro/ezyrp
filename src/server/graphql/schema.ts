import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    user: User
  }

  type Mutation {
    login(credentials: LoginCredentials): User
    register(credentials: RegisterCredentials): User
  }

  input LoginCredentials {
    email: String!
    password: String!
  }

  input RegisterCredentials {
    email: String!
    password: String!
    username: String
    workspace: String
  }

  type User {
    id: ID!
    email: String!
    password: String!
    username: String!
  }

  type Credentials {
    email: String!
    password: String!
    username: String!
    workspace: String
  }
`;

import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    user: User

    customer(id: ID!): Customer
    customers(filters: InputCustomersFilters): [Customer]
  }

  type Mutation {
    logout: Boolean
    login(credentials: InputLoginCredentials): User
    register(credentials: InputRegisterCredentials): User

    createCustomers(createCustomerArgs: [InputCreateCustomerArgs!]!): [Customer]
    updateCustomers(updateCustomerArgs: [InputUpdateCustomerArgs!]!): [Customer]
    deleteCustomers(deleteCustomerArgs: [ID!]!): [ID]
  }

  input InputLoginCredentials {
    email: String!
    password: String!
  }

  input InputRegisterCredentials {
    email: String!
    password: String!
    username: String
    workspace: String
  }

  input InputCustomersFilters {
    email: String
    name: String
    phone: String
  }

  input InputCreateCustomerArgs {
    email: String!
    name: String!
    phone: String!
  }

  input InputUpdateCustomerArgs {
    id: ID!
    email: String
    name: String
    phone: String
  }

  type User {
    id: ID!
    email: String!
    password: String!
    username: String!
  }

  type Customer {
    id: ID!
    email: String!
    name: String!
    phone: String!
  }
`;

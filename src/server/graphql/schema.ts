import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    user: User

    customer(id: ID!): Customer!
    customers(filters: InputCustomersFilters): [Customer!]!

    invoice(id: ID!): Invoice!
    invoices: [Invoice!]!

    event(id: ID!): Event!
    events: [Event!]!

    countries: [Country!]!

    stats(filters: InputStatsFilters): Stats!

    getCloudinarySignature: CloudinarySignature!
  }

  type Mutation {
    logout: Boolean
    login(credentials: InputLoginCredentials): User
    register(credentials: InputRegisterCredentials): User

    updateUserProfile(updateUserProfileArgs: InputUpdateUserProfileArgs!): User

    createCustomers(createCustomerArgs: [InputCreateCustomerArgs!]!): [Customer]
    updateCustomers(updateCustomerArgs: [InputUpdateCustomerArgs!]!): [Customer]
    deleteCustomers(deleteCustomerArgs: [ID!]!): [ID]

    createInvoices(createInvoicesArgs: [InputCreateInvoicesArgs!]!): [Invoice]
    updateInvoices(updateInvoicesArgs: [InputUpdateInvoicesArgs!]!): [Invoice]
    deleteInvoices(deleteInvoicesArgs: [ID!]!): [ID]

    createEvents(createEventsInput: [InputCreateEventsArgs!]!): [Event]
    updateEvents(updateEventsInput: [InputUpdateEventsArgs!]!): [Event]
    deleteEvents(deleteEventsInput: [ID!]!): [ID]
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

  input InputUpdateUserProfileArgs {
    photoUrl: String
    address: String
    city: String
    code: String
    country: String
    name: String
  }

  type Profile {
    photoUrl: String
    address: String!
    city: String!
    code: String!
    country: String!
    name: String!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    username: String!
    profile: Profile
  }

  input InputCustomersFilters {
    email: String
    name: String
    phone: String
  }

  input InputCreateCustomerArgs {
    email: String!
    name: String!
    phone: String
    photoUrl: String
  }

  input InputUpdateCustomerArgs {
    id: ID!
    email: String
    name: String
    phone: String
    photoUrl: String
  }

  type LastInvoice {
    emitted: String!
    amount: Int!
    status: String!
  }

  type Customer {
    id: ID!
    email: String!
    name: String!
    phone: String
    photoUrl: String
    lastInvoice: LastInvoice
  }

  input InputCreateInvoiceItems {
    name: String!
    quantity: Int!
    price: Int!
  }

  input InputCreateInvoicesArgs {
    customer: ID!
    description: String!
    status: String!
    items: [InputCreateInvoiceItems!]!
    due: String!
    emitted: String!
  }

  input InputUpdateInvoiceItems {
    name: String!
    quantity: Int!
    price: Int!
  }

  input InputUpdateInvoicesArgs {
    id: ID!
    customer: ID
    description: String
    status: String
    items: [InputUpdateInvoiceItems]
    due: String
    emitted: String
  }

  type Item {
    name: String!
    quantity: Int!
    price: Int!
  }

  type Invoice {
    id: ID!
    customer: Customer!
    description: String!
    status: String!
    items: [Item!]
    amount: Int!
    due: String!
    emitted: String!
  }

  input InputCreateEventsArgs {
    start: String!
    end: String!
    title: String!
    variant: String!
    guests: [String]
  }

  input InputUpdateEventsArgs {
    id: ID!
    start: String
    end: String
    title: String
    variant: String
    guests: [String]
  }

  type Guest {
    id: ID!
    email: String!
    name: String!
    phone: String!
  }

  type Event {
    id: ID!
    start: String!
    end: String!
    title: String!
    variant: String!
    guests: [Guest!]!
  }

  type CountryName {
    common: String!
    official: String!
  }

  type Country {
    name: CountryName!
  }

  input InputStatsFilters {
    period: Int!
  }

  type Stat {
    name: String!
    value: Int!
    change: Float!
  }

  type Stats {
    pending: Stat!
    overdue: Stat!
    paid: Stat!
  }

  type CloudinarySignature {
    timestamp: Int!
    signature: String!
    cloudname: String!
    apiKey: String!
  }
`;

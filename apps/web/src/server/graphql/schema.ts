import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    user: User!
    users: [TeamUser!]!
    invites: [Invite!]!

    customer(id: ID!): Customer!
    customers(
      filters: InputCustomersFilters
      orderBy: InputCustomersOrderBy
    ): PagedCustomersResponse!

    invoice(id: ID!): Invoice!
    invoices(filters: InputInvoicesFilters): PagedInvoicesResponse!

    eventType(id: ID!): EventType!
    eventTypes: [EventType!]!

    event(id: ID!): Event!
    events: [Event!]!

    booking(id: ID!, day: String!): Booking

    item(id: ID!): Item!
    items(filters: InputItemsFilters): PagedItemsResponse!

    subscription: Subscription

    countries: [Country!]!

    stats(filters: InputStatsFilters): Stats!

    getCloudinarySignature(folder: String): CloudinarySignature!

    settings: Settings
  }

  type Mutation {
    logout: Boolean
    login(credentials: InputLoginCredentials): User
    register(credentials: InputRegisterCredentials): User
    resetPassword(credentials: InputResetPasswordCredentials): User
    updateUserProfile(updateUserProfileArgs: InputUpdateUserProfileArgs!): User
    deleteAccount: Boolean

    createInvites(createInviteArgs: [InputCreateInviteArgs!]!): [Invite!]!

    createCustomers(createCustomerArgs: [InputCreateCustomerArgs!]!): [Customer]
    updateCustomers(updateCustomerArgs: [InputUpdateCustomerArgs!]!): [Customer]
    deleteCustomers(deleteCustomerArgs: [ID!]!): [ID]

    createInvoices(createInvoicesArgs: [InputCreateInvoicesArgs!]!): [Invoice]
    updateInvoices(updateInvoicesArgs: [InputUpdateInvoicesArgs!]!): [Invoice]
    deleteInvoices(deleteInvoicesArgs: [ID!]!): [ID]

    createEventTypes(
      createEventTypesInput: [InputCreateEventTypeArgs!]!
    ): [EventType!]!
    updateEventTypes(
      updateEventTypesInput: [InputUpdateEventTypeArgs!]!
    ): [EventType!]!
    deleteEventTypes(ids: [ID!]!): [ID!]!

    createEvents(createEventsInput: [InputCreateEventArgs!]!): [Event]
    updateEvents(updateEventsInput: [InputUpdateEventsArgs!]!): [Event]
    deleteEvents(deleteEventsInput: [ID!]!): [ID]

    createItems(createItemsInput: [InputCreateItems!]!): [Item]
    updateItems(updateItemsInput: [InputUpdateItems!]!): [Item]
    deleteItems(deleteItemsInput: [ID!]!): [ID]

    createSubscription(subscriptionInput: SubscriptionInput): Subscription

    updateSettings(updateSettingsInput: InputUpdateSettings): Settings
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

  input InputResetPasswordCredentials {
    currentPassword: String!
    newPassword: String!
    confirmPassword: String!
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

  type TeamUser {
    id: ID!
    email: String!
    username: String!
    photoUrl: String
  }

  type Invite {
    id: ID!
    email: String!
    sent_at: String
  }

  input InputCustomersFilters {
    start: Int
    limit: Int
    email: String
    name: String
  }

  enum Sort {
    asc
    desc
  }

  input InputCustomersOrderBy {
    lastInvoice: Sort
  }

  input InputCreateInviteArgs {
    email: String!
  }

  input InputCreateCustomerArgs {
    email: String!
    name: String!
    address: String!
    city: String!
    code: String!
    country: String!
    photoUrl: String
  }

  input InputUpdateCustomerArgs {
    id: ID!
    email: String
    name: String
    photoUrl: String
    address: String
    city: String
    code: String
    country: String
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
    photoUrl: String
    address: String!
    city: String!
    code: String!
    country: String!
    lastInvoice: LastInvoice
  }

  input InputCreateInvoicesArgs {
    customer: ID!
    description: String!
    status: String!
    items: [ID!]!
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

  input InputInvoicesFilters {
    start: Int
    limit: Int
  }

  type InvoiceItem {
    id: ID!
    name: String!
    quantity: Int!
    price: Int!
  }

  type Invoice {
    id: ID!
    customer: Customer!
    description: String!
    status: String!
    items: [InvoiceItem!]!
    amount: Int!
    due: String!
    emitted: String!
  }

  input InputCreateEventArgs {
    start: String!
    type: ID!
    notes: String
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
  }

  input InputCreateEventTypeArgs {
    name: String!
    variant: String!
    "Event duration, in minutes"
    duration: Int!
    description: String
  }

  input InputUpdateEventTypeArgs {
    id: ID!
    name: String
    variant: String
    "Event duration, in minutes"
    duration: Int
    description: String
  }

  type EventType {
    id: ID!
    name: String!
    description: String
    variant: String!
    "Event duration, in minutes"
    duration: Int!
  }

  type Event {
    id: ID!
    end: String!
    start: String!
    title: String!
    notes: String
    variant: String!
    guests: [Guest!]!
  }

  type Booking {
    id: ID!
    name: String!
    duration: Int!
    description: String
    slots: [String!]!
    "Working days. 0 is monday."
    days: [Int!]!
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
    tags: [String!]!
  }

  input InputCreateItems {
    name: String!
    description: String
    price: Int!
    quantity: Int!
    onetime: Boolean
  }

  input InputUpdateItems {
    id: ID!
    name: String
    description: String
    price: Int
    quantity: Int
  }

  input InputItemsFilters {
    limit: Int
    start: Int
  }

  type Item {
    id: ID!
    name: String!
    description: String
    price: Int!
    "This is the quantity of items left in the inventory"
    quantity: Int!
  }

  union Pageable = Customer | Invoice | Item

  interface PagedSearchResponse {
    total: Int!
    results: [Pageable!]!
  }

  type PagedCustomersResponse implements PagedSearchResponse {
    total: Int!
    results: [Customer!]!
  }

  type PagedInvoicesResponse implements PagedSearchResponse {
    total: Int!
    results: [Invoice!]!
  }

  type PagedItemsResponse implements PagedSearchResponse {
    total: Int!
    results: [Item!]!
  }

  input SubscrptionKeyInput {
    p256dh: String!
    auth: String!
  }

  input SubscriptionInput {
    endpoint: String!
    expirationTime: Int
    keys: SubscrptionKeyInput!
  }

  type SubscrptionKey {
    p256dh: String!
    auth: String!
  }

  type Subscription {
    endpoint: String!
    expirationTime: Int
    keys: SubscrptionKey!
  }

  input InputUpdateSettings {
    start: Float!
    end: Float!
    days: [Int!]!
  }

  type Settings {
    start: Float
    end: Float
    days: [Int!]
  }
`;

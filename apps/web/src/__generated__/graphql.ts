/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CloudinarySignature = {
  __typename?: 'CloudinarySignature';
  apiKey: Scalars['String']['output'];
  cloudname: Scalars['String']['output'];
  signature: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
  timestamp: Scalars['Int']['output'];
};

export type Country = {
  __typename?: 'Country';
  name: CountryName;
};

export type CountryName = {
  __typename?: 'CountryName';
  common: Scalars['String']['output'];
  official: Scalars['String']['output'];
};

export type Customer = {
  __typename?: 'Customer';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  code: Scalars['String']['output'];
  country: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastInvoice?: Maybe<LastInvoice>;
  name: Scalars['String']['output'];
  photoUrl?: Maybe<Scalars['String']['output']>;
};

export type Event = {
  __typename?: 'Event';
  end: Scalars['String']['output'];
  guests: Array<Guest>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  start: Scalars['String']['output'];
  title: Scalars['String']['output'];
  variant: Scalars['String']['output'];
};

export type Guest = {
  __typename?: 'Guest';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type InputCreateCustomerArgs = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  code: Scalars['String']['input'];
  country: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  photoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type InputCreateEventsArgs = {
  end: Scalars['String']['input'];
  guests?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  start: Scalars['String']['input'];
  title: Scalars['String']['input'];
  variant: Scalars['String']['input'];
};

export type InputCreateInviteArgs = {
  email: Scalars['String']['input'];
};

export type InputCreateInvoicesArgs = {
  customer: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  due: Scalars['String']['input'];
  emitted: Scalars['String']['input'];
  items: Array<Scalars['ID']['input']>;
  status: Scalars['String']['input'];
};

export type InputCreateItems = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  onetime?: InputMaybe<Scalars['Boolean']['input']>;
  price: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
};

export type InputCustomersFilters = {
  email?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};

export type InputCustomersOrderBy = {
  lastInvoice?: InputMaybe<Sort>;
};

export type InputInvoicesFilters = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};

export type InputItemsFilters = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};

export type InputLoginCredentials = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type InputRegisterCredentials = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
  workspace?: InputMaybe<Scalars['String']['input']>;
};

export type InputResetPasswordCredentials = {
  confirmPassword: Scalars['String']['input'];
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type InputStatsFilters = {
  period: Scalars['Int']['input'];
};

export type InputUpdateCustomerArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type InputUpdateEventsArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  guests?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id: Scalars['ID']['input'];
  start?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  variant?: InputMaybe<Scalars['String']['input']>;
};

export type InputUpdateInvoiceItems = {
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
};

export type InputUpdateInvoicesArgs = {
  customer?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  due?: InputMaybe<Scalars['String']['input']>;
  emitted?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  items?: InputMaybe<Array<InputMaybe<InputUpdateInvoiceItems>>>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type InputUpdateItems = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

export type InputUpdateSettings = {
  days: Array<Scalars['Int']['input']>;
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

export type InputUpdateUserProfileArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type Invite = {
  __typename?: 'Invite';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  sent_at?: Maybe<Scalars['String']['output']>;
};

export type Invoice = {
  __typename?: 'Invoice';
  amount: Scalars['Int']['output'];
  customer: Customer;
  description: Scalars['String']['output'];
  due: Scalars['String']['output'];
  emitted: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  items: Array<InvoiceItem>;
  status: Scalars['String']['output'];
};

export type InvoiceItem = {
  __typename?: 'InvoiceItem';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
};

export type Item = {
  __typename?: 'Item';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
  /** This is the quantity of items left in the inventory */
  quantity: Scalars['Int']['output'];
};

export type LastInvoice = {
  __typename?: 'LastInvoice';
  amount: Scalars['Int']['output'];
  emitted: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCustomers?: Maybe<Array<Maybe<Customer>>>;
  createEvents?: Maybe<Array<Maybe<Event>>>;
  createInvites: Array<Invite>;
  createInvoices?: Maybe<Array<Maybe<Invoice>>>;
  createItems?: Maybe<Array<Maybe<Item>>>;
  createSubscription?: Maybe<Subscription>;
  deleteAccount?: Maybe<Scalars['Boolean']['output']>;
  deleteCustomers?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  deleteEvents?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  deleteInvoices?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  deleteItems?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  login?: Maybe<User>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  register?: Maybe<User>;
  resetPassword?: Maybe<User>;
  updateCustomers?: Maybe<Array<Maybe<Customer>>>;
  updateEvents?: Maybe<Array<Maybe<Event>>>;
  updateInvoices?: Maybe<Array<Maybe<Invoice>>>;
  updateItems?: Maybe<Array<Maybe<Item>>>;
  updateSettings?: Maybe<Settings>;
  updateUserProfile?: Maybe<User>;
};


export type MutationCreateCustomersArgs = {
  createCustomerArgs: Array<InputCreateCustomerArgs>;
};


export type MutationCreateEventsArgs = {
  createEventsInput: Array<InputCreateEventsArgs>;
};


export type MutationCreateInvitesArgs = {
  createInviteArgs: Array<InputCreateInviteArgs>;
};


export type MutationCreateInvoicesArgs = {
  createInvoicesArgs: Array<InputCreateInvoicesArgs>;
};


export type MutationCreateItemsArgs = {
  createItemsInput: Array<InputCreateItems>;
};


export type MutationCreateSubscriptionArgs = {
  subscriptionInput?: InputMaybe<SubscriptionInput>;
};


export type MutationDeleteCustomersArgs = {
  deleteCustomerArgs: Array<Scalars['ID']['input']>;
};


export type MutationDeleteEventsArgs = {
  deleteEventsInput: Array<Scalars['ID']['input']>;
};


export type MutationDeleteInvoicesArgs = {
  deleteInvoicesArgs: Array<Scalars['ID']['input']>;
};


export type MutationDeleteItemsArgs = {
  deleteItemsInput: Array<Scalars['ID']['input']>;
};


export type MutationLoginArgs = {
  credentials?: InputMaybe<InputLoginCredentials>;
};


export type MutationRegisterArgs = {
  credentials?: InputMaybe<InputRegisterCredentials>;
};


export type MutationResetPasswordArgs = {
  credentials?: InputMaybe<InputResetPasswordCredentials>;
};


export type MutationUpdateCustomersArgs = {
  updateCustomerArgs: Array<InputUpdateCustomerArgs>;
};


export type MutationUpdateEventsArgs = {
  updateEventsInput: Array<InputUpdateEventsArgs>;
};


export type MutationUpdateInvoicesArgs = {
  updateInvoicesArgs: Array<InputUpdateInvoicesArgs>;
};


export type MutationUpdateItemsArgs = {
  updateItemsInput: Array<InputUpdateItems>;
};


export type MutationUpdateSettingsArgs = {
  updateSettingsInput?: InputMaybe<InputUpdateSettings>;
};


export type MutationUpdateUserProfileArgs = {
  updateUserProfileArgs: InputUpdateUserProfileArgs;
};

export type Pageable = Customer | Invoice | Item;

export type PagedCustomersResponse = PagedSearchResponse & {
  __typename?: 'PagedCustomersResponse';
  results: Array<Customer>;
  total: Scalars['Int']['output'];
};

export type PagedInvoicesResponse = PagedSearchResponse & {
  __typename?: 'PagedInvoicesResponse';
  results: Array<Invoice>;
  total: Scalars['Int']['output'];
};

export type PagedItemsResponse = PagedSearchResponse & {
  __typename?: 'PagedItemsResponse';
  results: Array<Item>;
  total: Scalars['Int']['output'];
};

export type PagedSearchResponse = {
  results: Array<Pageable>;
  total: Scalars['Int']['output'];
};

export type Profile = {
  __typename?: 'Profile';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  code: Scalars['String']['output'];
  country: Scalars['String']['output'];
  name: Scalars['String']['output'];
  photoUrl?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  countries: Array<Country>;
  customer: Customer;
  customers: PagedCustomersResponse;
  event: Event;
  events: Array<Event>;
  getCloudinarySignature: CloudinarySignature;
  invites: Array<Invite>;
  invoice: Invoice;
  invoices: PagedInvoicesResponse;
  item: Item;
  items: PagedItemsResponse;
  settings?: Maybe<Settings>;
  stats: Stats;
  subscription?: Maybe<Subscription>;
  user: User;
  users: Array<TeamUser>;
};


export type QueryCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomersArgs = {
  filters?: InputMaybe<InputCustomersFilters>;
  orderBy?: InputMaybe<InputCustomersOrderBy>;
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCloudinarySignatureArgs = {
  folder?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvoicesArgs = {
  filters?: InputMaybe<InputInvoicesFilters>;
};


export type QueryItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryItemsArgs = {
  filters?: InputMaybe<InputItemsFilters>;
};


export type QueryStatsArgs = {
  filters?: InputMaybe<InputStatsFilters>;
};

export type Settings = {
  __typename?: 'Settings';
  days?: Maybe<Array<Scalars['Int']['output']>>;
  end?: Maybe<Scalars['String']['output']>;
  start?: Maybe<Scalars['String']['output']>;
};

export enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export type Stat = {
  __typename?: 'Stat';
  change: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type Stats = {
  __typename?: 'Stats';
  overdue: Stat;
  paid: Stat;
  pending: Stat;
};

export type Subscription = {
  __typename?: 'Subscription';
  endpoint: Scalars['String']['output'];
  expirationTime?: Maybe<Scalars['Int']['output']>;
  keys: SubscrptionKey;
};

export type SubscriptionInput = {
  endpoint: Scalars['String']['input'];
  expirationTime?: InputMaybe<Scalars['Int']['input']>;
  keys: SubscrptionKeyInput;
};

export type SubscrptionKey = {
  __typename?: 'SubscrptionKey';
  auth: Scalars['String']['output'];
  p256dh: Scalars['String']['output'];
};

export type SubscrptionKeyInput = {
  auth: Scalars['String']['input'];
  p256dh: Scalars['String']['input'];
};

export type TeamUser = {
  __typename?: 'TeamUser';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  photoUrl?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  password: Scalars['String']['output'];
  profile?: Maybe<Profile>;
  username: Scalars['String']['output'];
};

export type CreateCustomersMutationVariables = Exact<{
  createCustomerArgs: Array<InputCreateCustomerArgs> | InputCreateCustomerArgs;
}>;


export type CreateCustomersMutation = { __typename?: 'Mutation', createCustomers?: Array<{ __typename?: 'Customer', id: string, email: string, name: string } | null> | null };

export type CreateEventsMutationVariables = Exact<{
  createEventsInput: Array<InputCreateEventsArgs> | InputCreateEventsArgs;
}>;


export type CreateEventsMutation = { __typename?: 'Mutation', createEvents?: Array<{ __typename?: 'Event', id: string, start: string, end: string, title: string, variant: string, guests: Array<{ __typename?: 'Guest', id: string, email: string, name: string }> } | null> | null };

export type CreateInvitesMutationVariables = Exact<{
  createInviteArgs: Array<InputCreateInviteArgs> | InputCreateInviteArgs;
}>;


export type CreateInvitesMutation = { __typename?: 'Mutation', createInvites: Array<{ __typename?: 'Invite', id: string, email: string, sent_at?: string | null }> };

export type CreateInvoicesMutationVariables = Exact<{
  createInvoicesArgs: Array<InputCreateInvoicesArgs> | InputCreateInvoicesArgs;
}>;


export type CreateInvoicesMutation = { __typename?: 'Mutation', createInvoices?: Array<{ __typename?: 'Invoice', id: string, description: string, status: string, amount: number, due: string, emitted: string, customer: { __typename?: 'Customer', id: string, email: string, name: string }, items: Array<{ __typename?: 'InvoiceItem', name: string, quantity: number, price: number }> } | null> | null };

export type CreateItemsMutationVariables = Exact<{
  createItemsInput: Array<InputCreateItems> | InputCreateItems;
}>;


export type CreateItemsMutation = { __typename?: 'Mutation', createItems?: Array<{ __typename?: 'Item', id: string, name: string, description?: string | null, price: number, quantity: number } | null> | null };

export type CreateSubscriptionMutationVariables = Exact<{
  subscriptionInput: SubscriptionInput;
}>;


export type CreateSubscriptionMutation = { __typename?: 'Mutation', createSubscription?: { __typename?: 'Subscription', endpoint: string, expirationTime?: number | null, keys: { __typename?: 'SubscrptionKey', p256dh: string, auth: string } } | null };

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount?: boolean | null };

export type DeleteCustomersMutationVariables = Exact<{
  deleteCustomerArgs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteCustomersMutation = { __typename?: 'Mutation', deleteCustomers?: Array<string | null> | null };

export type DeleteEventsMutationVariables = Exact<{
  deleteEventsInput: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteEventsMutation = { __typename?: 'Mutation', deleteEvents?: Array<string | null> | null };

export type DeleteInvoicesMutationVariables = Exact<{
  deleteInvoicesArgs: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteInvoicesMutation = { __typename?: 'Mutation', deleteInvoices?: Array<string | null> | null };

export type DeleteItemsMutationVariables = Exact<{
  deleteItemsInput: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteItemsMutation = { __typename?: 'Mutation', deleteItems?: Array<string | null> | null };

export type LoginMutationVariables = Exact<{
  credentials: InputLoginCredentials;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', id: string, email: string, password: string, username: string, profile?: { __typename?: 'Profile', address: string, city: string, code: string, country: string, name: string } | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: boolean | null };

export type RegisterMutationVariables = Exact<{
  credentials: InputRegisterCredentials;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'User', id: string, email: string, password: string, username: string, profile?: { __typename?: 'Profile', address: string, city: string, code: string, country: string, name: string } | null } | null };

export type ResetPasswordMutationVariables = Exact<{
  credentials: InputResetPasswordCredentials;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword?: { __typename?: 'User', id: string, email: string, password: string, username: string, profile?: { __typename?: 'Profile', photoUrl?: string | null, address: string, city: string, code: string, country: string, name: string } | null } | null };

export type UpdateCustomersMutationVariables = Exact<{
  updateCustomerArgs: Array<InputUpdateCustomerArgs> | InputUpdateCustomerArgs;
}>;


export type UpdateCustomersMutation = { __typename?: 'Mutation', updateCustomers?: Array<{ __typename?: 'Customer', id: string, email: string, name: string } | null> | null };

export type UpdateEventsMutationVariables = Exact<{
  updateEventsInput: Array<InputUpdateEventsArgs> | InputUpdateEventsArgs;
}>;


export type UpdateEventsMutation = { __typename?: 'Mutation', updateEvents?: Array<{ __typename?: 'Event', id: string, start: string, end: string, title: string, variant: string, guests: Array<{ __typename?: 'Guest', id: string, email: string, name: string }> } | null> | null };

export type UpdateInvoicesMutationVariables = Exact<{
  updateInvoicesArgs: Array<InputUpdateInvoicesArgs> | InputUpdateInvoicesArgs;
}>;


export type UpdateInvoicesMutation = { __typename?: 'Mutation', updateInvoices?: Array<{ __typename?: 'Invoice', id: string, description: string, status: string, amount: number, due: string, emitted: string, customer: { __typename?: 'Customer', id: string, email: string, name: string }, items: Array<{ __typename?: 'InvoiceItem', name: string, quantity: number, price: number }> } | null> | null };

export type UpdateItemsMutationVariables = Exact<{
  updateItemsInput: Array<InputUpdateItems> | InputUpdateItems;
}>;


export type UpdateItemsMutation = { __typename?: 'Mutation', updateItems?: Array<{ __typename?: 'Item', id: string, name: string, description?: string | null, price: number, quantity: number } | null> | null };

export type UpdateSettingsMutationVariables = Exact<{
  updateSettingsInput?: InputMaybe<InputUpdateSettings>;
}>;


export type UpdateSettingsMutation = { __typename?: 'Mutation', updateSettings?: { __typename?: 'Settings', start?: string | null, end?: string | null, days?: Array<number> | null } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  updateUserProfileArgs: InputUpdateUserProfileArgs;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUserProfile?: { __typename?: 'User', id: string, email: string, password: string, username: string, profile?: { __typename?: 'Profile', photoUrl?: string | null, address: string, city: string, code: string, country: string, name: string } | null } | null };

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = { __typename?: 'Query', countries: Array<{ __typename?: 'Country', name: { __typename?: 'CountryName', common: string, official: string } }> };

export type GetCustomerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCustomerQuery = { __typename?: 'Query', customer: { __typename?: 'Customer', id: string, email: string, name: string, photoUrl?: string | null, address: string, city: string, code: string, country: string } };

export type GetCustomersQueryVariables = Exact<{
  filters?: InputMaybe<InputCustomersFilters>;
}>;


export type GetCustomersQuery = { __typename?: 'Query', customers: { __typename?: 'PagedCustomersResponse', total: number, results: Array<{ __typename?: 'Customer', id: string, email: string, name: string, photoUrl?: string | null, address: string, city: string, code: string, country: string }> } };

export type CustomersWithLastInvoiceQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomersWithLastInvoiceQuery = { __typename?: 'Query', customers: { __typename?: 'PagedCustomersResponse', results: Array<{ __typename?: 'Customer', id: string, name: string, email: string, photoUrl?: string | null, lastInvoice?: { __typename?: 'LastInvoice', status: string, amount: number, emitted: string } | null }> } };

export type EventsQueryVariables = Exact<{ [key: string]: never; }>;


export type EventsQuery = { __typename?: 'Query', events: Array<{ __typename?: 'Event', id: string, start: string, end: string, title: string, variant: string, guests: Array<{ __typename?: 'Guest', id: string, email: string, name: string }> }> };

export type GetCloudinarySignatureQueryVariables = Exact<{
  folder?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCloudinarySignatureQuery = { __typename?: 'Query', getCloudinarySignature: { __typename?: 'CloudinarySignature', timestamp: number, signature: string, cloudname: string, apiKey: string, tags: Array<string> } };

export type InvitesQueryVariables = Exact<{ [key: string]: never; }>;


export type InvitesQuery = { __typename?: 'Query', invites: Array<{ __typename?: 'Invite', id: string, email: string, sent_at?: string | null }> };

export type InvoiceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type InvoiceQuery = { __typename?: 'Query', invoice: { __typename?: 'Invoice', id: string, status: string, description: string, due: string, emitted: string, amount: number, items: Array<{ __typename?: 'InvoiceItem', name: string, price: number, quantity: number }>, customer: { __typename?: 'Customer', id: string, name: string, email: string } } };

export type InvoicesQueryVariables = Exact<{
  filters?: InputMaybe<InputInvoicesFilters>;
}>;


export type InvoicesQuery = { __typename?: 'Query', invoices: { __typename?: 'PagedInvoicesResponse', total: number, results: Array<{ __typename?: 'Invoice', id: string, description: string, status: string, amount: number, due: string, emitted: string, customer: { __typename?: 'Customer', id: string, email: string, name: string }, items: Array<{ __typename?: 'InvoiceItem', id: string, name: string, quantity: number, price: number }> }> } };

export type ItemQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ItemQuery = { __typename?: 'Query', item: { __typename?: 'Item', id: string, name: string, quantity: number, price: number, description?: string | null } };

export type ItemsQueryVariables = Exact<{
  filters?: InputMaybe<InputItemsFilters>;
}>;


export type ItemsQuery = { __typename?: 'Query', items: { __typename?: 'PagedItemsResponse', total: number, results: Array<{ __typename?: 'Item', id: string, name: string, quantity: number, price: number, description?: string | null }> } };

export type SettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type SettingsQuery = { __typename?: 'Query', settings?: { __typename?: 'Settings', start?: string | null, end?: string | null, days?: Array<number> | null } | null };

export type StatsQueryVariables = Exact<{
  filters?: InputMaybe<InputStatsFilters>;
}>;


export type StatsQuery = { __typename?: 'Query', stats: { __typename?: 'Stats', pending: { __typename?: 'Stat', name: string, value: number, change: number }, overdue: { __typename?: 'Stat', name: string, value: number, change: number }, paid: { __typename?: 'Stat', name: string, value: number, change: number } } };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, email: string, username: string, profile?: { __typename?: 'Profile', photoUrl?: string | null, address: string, city: string, country: string, code: string, name: string } | null } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'TeamUser', id: string, email: string, username: string, photoUrl?: string | null }> };


export const CreateCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createCustomerArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputCreateCustomerArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createCustomerArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createCustomerArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateCustomersMutation, CreateCustomersMutationVariables>;
export const CreateEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createEventsInput"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputCreateEventsArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createEventsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createEventsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"guests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateEventsMutation, CreateEventsMutationVariables>;
export const CreateInvitesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createInvites"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createInviteArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputCreateInviteArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInvites"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createInviteArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createInviteArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"sent_at"}}]}}]}}]} as unknown as DocumentNode<CreateInvitesMutation, CreateInvitesMutationVariables>;
export const CreateInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createInvoicesArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputCreateInvoicesArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInvoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createInvoicesArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createInvoicesArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"emitted"}}]}}]}}]} as unknown as DocumentNode<CreateInvoicesMutation, CreateInvoicesMutationVariables>;
export const CreateItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createItemsInput"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputCreateItems"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createItemsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createItemsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]} as unknown as DocumentNode<CreateItemsMutation, CreateItemsMutationVariables>;
export const CreateSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"subscriptionInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endpoint"}},{"kind":"Field","name":{"kind":"Name","value":"expirationTime"}},{"kind":"Field","name":{"kind":"Name","value":"keys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"p256dh"}},{"kind":"Field","name":{"kind":"Name","value":"auth"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSubscriptionMutation, CreateSubscriptionMutationVariables>;
export const DeleteAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAccount"}}]}}]} as unknown as DocumentNode<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const DeleteCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteCustomerArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deleteCustomerArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteCustomerArgs"}}}]}]}}]} as unknown as DocumentNode<DeleteCustomersMutation, DeleteCustomersMutationVariables>;
export const DeleteEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteEventsInput"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deleteEventsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteEventsInput"}}}]}]}}]} as unknown as DocumentNode<DeleteEventsMutation, DeleteEventsMutationVariables>;
export const DeleteInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteInvoicesArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInvoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deleteInvoicesArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteInvoicesArgs"}}}]}]}}]} as unknown as DocumentNode<DeleteInvoicesMutation, DeleteInvoicesMutationVariables>;
export const DeleteItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteItemsInput"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deleteItemsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteItemsInput"}}}]}]}}]} as unknown as DocumentNode<DeleteItemsMutation, DeleteItemsMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputLoginCredentials"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputRegisterCredentials"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"resetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputResetPasswordCredentials"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdateCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateCustomerArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUpdateCustomerArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateCustomerArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateCustomerArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateCustomersMutation, UpdateCustomersMutationVariables>;
export const UpdateEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateEventsInput"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUpdateEventsArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateEventsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateEventsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"guests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEventsMutation, UpdateEventsMutationVariables>;
export const UpdateInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateInvoicesArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUpdateInvoicesArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInvoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateInvoicesArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateInvoicesArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"emitted"}}]}}]}}]} as unknown as DocumentNode<UpdateInvoicesMutation, UpdateInvoicesMutationVariables>;
export const UpdateItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateItemsInput"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUpdateItems"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateItemsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateItemsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]} as unknown as DocumentNode<UpdateItemsMutation, UpdateItemsMutationVariables>;
export const UpdateSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateSettingsInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUpdateSettings"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateSettingsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateSettingsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"days"}}]}}]}}]} as unknown as DocumentNode<UpdateSettingsMutation, UpdateSettingsMutationVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserProfileArgs"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUpdateUserProfileArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateUserProfileArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserProfileArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const CountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"common"}},{"kind":"Field","name":{"kind":"Name","value":"official"}}]}}]}}]}}]} as unknown as DocumentNode<CountriesQuery, CountriesQueryVariables>;
export const GetCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]} as unknown as DocumentNode<GetCustomerQuery, GetCustomerQueryVariables>;
export const GetCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InputCustomersFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomersQuery, GetCustomersQueryVariables>;
export const CustomersWithLastInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"customersWithLastInvoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"3"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lastInvoice"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"lastInvoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"emitted"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CustomersWithLastInvoiceQuery, CustomersWithLastInvoiceQueryVariables>;
export const EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"guests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<EventsQuery, EventsQueryVariables>;
export const GetCloudinarySignatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCloudinarySignature"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folder"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"nimblerp","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCloudinarySignature"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"folder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folder"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}},{"kind":"Field","name":{"kind":"Name","value":"cloudname"}},{"kind":"Field","name":{"kind":"Name","value":"apiKey"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<GetCloudinarySignatureQuery, GetCloudinarySignatureQueryVariables>;
export const InvitesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"invites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"sent_at"}}]}}]}}]} as unknown as DocumentNode<InvitesQuery, InvitesQueryVariables>;
export const InvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"invoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"emitted"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<InvoiceQuery, InvoiceQueryVariables>;
export const InvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"invoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InputInvoicesFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"emitted"}}]}}]}}]}}]} as unknown as DocumentNode<InvoicesQuery, InvoicesQueryVariables>;
export const ItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"item"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<ItemQuery, ItemQueryVariables>;
export const ItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"items"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InputItemsFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<ItemsQuery, ItemsQueryVariables>;
export const SettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"days"}}]}}]}}]} as unknown as DocumentNode<SettingsQuery, SettingsQueryVariables>;
export const StatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"stats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InputStatsFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overdue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paid"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}}]}}]}}]} as unknown as DocumentNode<StatsQuery, StatsQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
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
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastInvoice?: Maybe<LastInvoice>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  photoUrl?: Maybe<Scalars['String']['output']>;
};

export type Event = {
  __typename?: 'Event';
  end: Scalars['String']['output'];
  guests: Array<Guest>;
  id: Scalars['ID']['output'];
  start: Scalars['String']['output'];
  title: Scalars['String']['output'];
  variant: Scalars['String']['output'];
};

export type Guest = {
  __typename?: 'Guest';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

export type InputCreateCustomerArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type InputCreateEventsArgs = {
  end: Scalars['String']['input'];
  guests?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  start: Scalars['String']['input'];
  title: Scalars['String']['input'];
  variant: Scalars['String']['input'];
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
  price: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
};

export type InputCustomersFilters = {
  email?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
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

export type InputStatsFilters = {
  period: Scalars['Int']['input'];
};

export type InputUpdateCustomerArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
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

export type InputUpdateUserProfileArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
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
  createInvoices?: Maybe<Array<Maybe<Invoice>>>;
  createItems?: Maybe<Array<Maybe<Item>>>;
  deleteCustomers?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  deleteEvents?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  deleteInvoices?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  login?: Maybe<User>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  register?: Maybe<User>;
  updateCustomers?: Maybe<Array<Maybe<Customer>>>;
  updateEvents?: Maybe<Array<Maybe<Event>>>;
  updateInvoices?: Maybe<Array<Maybe<Invoice>>>;
  updateUserProfile?: Maybe<User>;
};


export type MutationCreateCustomersArgs = {
  createCustomerArgs: Array<InputCreateCustomerArgs>;
};


export type MutationCreateEventsArgs = {
  createEventsInput: Array<InputCreateEventsArgs>;
};


export type MutationCreateInvoicesArgs = {
  createInvoicesArgs: Array<InputCreateInvoicesArgs>;
};


export type MutationCreateItemsArgs = {
  createItemsInput: Array<InputCreateItems>;
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


export type MutationLoginArgs = {
  credentials?: InputMaybe<InputLoginCredentials>;
};


export type MutationRegisterArgs = {
  credentials?: InputMaybe<InputRegisterCredentials>;
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
  customers?: Maybe<PagedCustomersResponse>;
  event: Event;
  events: Array<Event>;
  getCloudinarySignature: CloudinarySignature;
  invoice: Invoice;
  invoices?: Maybe<PagedInvoicesResponse>;
  items?: Maybe<PagedItemsResponse>;
  stats: Stats;
  user?: Maybe<User>;
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


export type QueryInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvoicesArgs = {
  filters?: InputMaybe<InputInvoicesFilters>;
};


export type QueryItemsArgs = {
  filters?: InputMaybe<InputItemsFilters>;
};


export type QueryStatsArgs = {
  filters?: InputMaybe<InputStatsFilters>;
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


export type CreateCustomersMutation = { __typename?: 'Mutation', createCustomers?: Array<{ __typename?: 'Customer', id: string, email: string, name: string, phone?: string | null } | null> | null };

export type CreateEventsMutationVariables = Exact<{
  createEventsInput: Array<InputCreateEventsArgs> | InputCreateEventsArgs;
}>;


export type CreateEventsMutation = { __typename?: 'Mutation', createEvents?: Array<{ __typename?: 'Event', id: string, start: string, end: string, title: string, variant: string, guests: Array<{ __typename?: 'Guest', id: string, email: string, name: string, phone: string }> } | null> | null };

export type CreateInvoicesMutationVariables = Exact<{
  createInvoicesArgs: Array<InputCreateInvoicesArgs> | InputCreateInvoicesArgs;
}>;


export type CreateInvoicesMutation = { __typename?: 'Mutation', createInvoices?: Array<{ __typename?: 'Invoice', id: string, description: string, status: string, amount: number, due: string, emitted: string, customer: { __typename?: 'Customer', id: string, email: string, name: string, phone?: string | null }, items: Array<{ __typename?: 'InvoiceItem', name: string, quantity: number, price: number }> } | null> | null };

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

export type UpdateCustomersMutationVariables = Exact<{
  updateCustomerArgs: Array<InputUpdateCustomerArgs> | InputUpdateCustomerArgs;
}>;


export type UpdateCustomersMutation = { __typename?: 'Mutation', updateCustomers?: Array<{ __typename?: 'Customer', id: string, email: string, name: string, phone?: string | null } | null> | null };

export type UpdateEventsMutationVariables = Exact<{
  updateEventsInput: Array<InputUpdateEventsArgs> | InputUpdateEventsArgs;
}>;


export type UpdateEventsMutation = { __typename?: 'Mutation', updateEvents?: Array<{ __typename?: 'Event', id: string, start: string, end: string, title: string, variant: string, guests: Array<{ __typename?: 'Guest', id: string, email: string, name: string, phone: string }> } | null> | null };

export type UpdateInvoicesMutationVariables = Exact<{
  updateInvoicesArgs: Array<InputUpdateInvoicesArgs> | InputUpdateInvoicesArgs;
}>;


export type UpdateInvoicesMutation = { __typename?: 'Mutation', updateInvoices?: Array<{ __typename?: 'Invoice', id: string, description: string, status: string, amount: number, due: string, emitted: string, customer: { __typename?: 'Customer', id: string, email: string, name: string, phone?: string | null }, items: Array<{ __typename?: 'InvoiceItem', name: string, quantity: number, price: number }> } | null> | null };

export type UpdateUserProfileMutationVariables = Exact<{
  updateUserProfileArgs: InputUpdateUserProfileArgs;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUserProfile?: { __typename?: 'User', id: string, email: string, password: string, username: string, profile?: { __typename?: 'Profile', photoUrl?: string | null, address: string, city: string, code: string, country: string, name: string } | null } | null };

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = { __typename?: 'Query', countries: Array<{ __typename?: 'Country', name: { __typename?: 'CountryName', common: string, official: string } }> };

export type GetCustomersQueryVariables = Exact<{
  filters?: InputMaybe<InputCustomersFilters>;
}>;


export type GetCustomersQuery = { __typename?: 'Query', customers?: { __typename?: 'PagedCustomersResponse', total: number, results: Array<{ __typename?: 'Customer', id: string, email: string, name: string, phone?: string | null, photoUrl?: string | null }> } | null };

export type CustomersWithLastInvoiceQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomersWithLastInvoiceQuery = { __typename?: 'Query', customers?: { __typename?: 'PagedCustomersResponse', results: Array<{ __typename?: 'Customer', id: string, name: string, email: string, photoUrl?: string | null, lastInvoice?: { __typename?: 'LastInvoice', status: string, amount: number, emitted: string } | null }> } | null };

export type EventsQueryVariables = Exact<{ [key: string]: never; }>;


export type EventsQuery = { __typename?: 'Query', events: Array<{ __typename?: 'Event', id: string, start: string, end: string, title: string, variant: string, guests: Array<{ __typename?: 'Guest', id: string, email: string, name: string, phone: string }> }> };

export type GetCloudinarySignatureQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCloudinarySignatureQuery = { __typename?: 'Query', getCloudinarySignature: { __typename?: 'CloudinarySignature', timestamp: number, signature: string, cloudname: string, apiKey: string } };

export type InvoiceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type InvoiceQuery = { __typename?: 'Query', invoice: { __typename?: 'Invoice', id: string, status: string, description: string, due: string, emitted: string, amount: number, items: Array<{ __typename?: 'InvoiceItem', name: string, price: number, quantity: number }>, customer: { __typename?: 'Customer', id: string, name: string, email: string } } };

export type InvoicesQueryVariables = Exact<{
  filters?: InputMaybe<InputInvoicesFilters>;
}>;


export type InvoicesQuery = { __typename?: 'Query', invoices?: { __typename?: 'PagedInvoicesResponse', total: number, results: Array<{ __typename?: 'Invoice', id: string, description: string, status: string, amount: number, due: string, emitted: string, customer: { __typename?: 'Customer', id: string, email: string, name: string, phone?: string | null }, items: Array<{ __typename?: 'InvoiceItem', name: string, quantity: number, price: number }> }> } | null };

export type ItemsQueryVariables = Exact<{
  filters?: InputMaybe<InputItemsFilters>;
}>;


export type ItemsQuery = { __typename?: 'Query', items?: { __typename?: 'PagedItemsResponse', total: number, results: Array<{ __typename?: 'Item', id: string, name: string, quantity: number, price: number, description?: string | null }> } | null };

export type StatsQueryVariables = Exact<{
  filters?: InputMaybe<InputStatsFilters>;
}>;


export type StatsQuery = { __typename?: 'Query', stats: { __typename?: 'Stats', pending: { __typename?: 'Stat', name: string, value: number, change: number }, overdue: { __typename?: 'Stat', name: string, value: number, change: number }, paid: { __typename?: 'Stat', name: string, value: number, change: number } } };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, email: string, username: string, profile?: { __typename?: 'Profile', photoUrl?: string | null, address: string, city: string, country: string, code: string, name: string } | null } | null };


export const CreateCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createCustomerArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputCreateCustomerArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createCustomerArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createCustomerArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<CreateCustomersMutation, CreateCustomersMutationVariables>;
export const CreateEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createEventsInput"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputCreateEventsArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createEventsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createEventsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"guests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<CreateEventsMutation, CreateEventsMutationVariables>;
export const CreateInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createInvoicesArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputCreateInvoicesArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInvoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createInvoicesArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createInvoicesArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"emitted"}}]}}]}}]} as unknown as DocumentNode<CreateInvoicesMutation, CreateInvoicesMutationVariables>;
export const DeleteCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteCustomerArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deleteCustomerArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteCustomerArgs"}}}]}]}}]} as unknown as DocumentNode<DeleteCustomersMutation, DeleteCustomersMutationVariables>;
export const DeleteEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteEventsInput"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deleteEventsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteEventsInput"}}}]}]}}]} as unknown as DocumentNode<DeleteEventsMutation, DeleteEventsMutationVariables>;
export const DeleteInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteInvoicesArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInvoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deleteInvoicesArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteInvoicesArgs"}}}]}]}}]} as unknown as DocumentNode<DeleteInvoicesMutation, DeleteInvoicesMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputLoginCredentials"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputRegisterCredentials"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const UpdateCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateCustomerArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUpdateCustomerArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateCustomerArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateCustomerArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<UpdateCustomersMutation, UpdateCustomersMutationVariables>;
export const UpdateEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateEventsInput"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUpdateEventsArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateEventsInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateEventsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"guests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEventsMutation, UpdateEventsMutationVariables>;
export const UpdateInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateInvoicesArgs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUpdateInvoicesArgs"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInvoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateInvoicesArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateInvoicesArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"emitted"}}]}}]}}]} as unknown as DocumentNode<UpdateInvoicesMutation, UpdateInvoicesMutationVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserProfileArgs"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUpdateUserProfileArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateUserProfileArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserProfileArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const CountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"common"}},{"kind":"Field","name":{"kind":"Name","value":"official"}}]}}]}}]}}]} as unknown as DocumentNode<CountriesQuery, CountriesQueryVariables>;
export const GetCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InputCustomersFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomersQuery, GetCustomersQueryVariables>;
export const CustomersWithLastInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"customersWithLastInvoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"3"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lastInvoice"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"lastInvoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"emitted"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CustomersWithLastInvoiceQuery, CustomersWithLastInvoiceQueryVariables>;
export const EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"guests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<EventsQuery, EventsQueryVariables>;
export const GetCloudinarySignatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCloudinarySignature"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCloudinarySignature"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}},{"kind":"Field","name":{"kind":"Name","value":"cloudname"}},{"kind":"Field","name":{"kind":"Name","value":"apiKey"}}]}}]}}]} as unknown as DocumentNode<GetCloudinarySignatureQuery, GetCloudinarySignatureQueryVariables>;
export const InvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"invoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"emitted"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<InvoiceQuery, InvoiceQueryVariables>;
export const InvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"invoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InputInvoicesFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"emitted"}}]}}]}}]}}]} as unknown as DocumentNode<InvoicesQuery, InvoicesQueryVariables>;
export const ItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"items"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InputItemsFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<ItemsQuery, ItemsQueryVariables>;
export const StatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"stats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InputStatsFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overdue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paid"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"change"}}]}}]}}]}}]} as unknown as DocumentNode<StatsQuery, StatsQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
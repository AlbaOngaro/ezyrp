/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation createCustomers($createCustomerArgs: [InputCreateCustomerArgs!]!) {\n    createCustomers(createCustomerArgs: $createCustomerArgs) {\n      id\n      email\n      name\n      phone\n    }\n  }\n": types.CreateCustomersDocument,
    "\n  mutation createEvents($createEventsInput: [InputCreateEventsArgs!]!) {\n    createEvents(createEventsInput: $createEventsInput) {\n      id\n      start\n      end\n      title\n      variant\n      guests {\n        id\n        email\n        name\n        phone\n      }\n    }\n  }\n": types.CreateEventsDocument,
    "\n  mutation createInvoices($createInvoicesArgs: [InputCreateInvoicesArgs!]!) {\n    createInvoices(createInvoicesArgs: $createInvoicesArgs) {\n      id\n      customer {\n        id\n        email\n        name\n        phone\n      }\n      description\n      status\n      items {\n        name\n        quantity\n        price\n      }\n      amount\n      due\n      emitted\n    }\n  }\n": types.CreateInvoicesDocument,
    "\n  mutation deleteCustomers($deleteCustomerArgs: [ID!]!) {\n    deleteCustomers(deleteCustomerArgs: $deleteCustomerArgs)\n  }\n": types.DeleteCustomersDocument,
    "\n  mutation deleteEvents($deleteEventsInput: [ID!]!) {\n    deleteEvents(deleteEventsInput: $deleteEventsInput)\n  }\n": types.DeleteEventsDocument,
    "\n  mutation deleteInvoices($deleteInvoicesArgs: [ID!]!) {\n    deleteInvoices(deleteInvoicesArgs: $deleteInvoicesArgs)\n  }\n": types.DeleteInvoicesDocument,
    "\n  mutation login($credentials: InputLoginCredentials!) {\n    login(credentials: $credentials) {\n      id\n      email\n      password\n      username\n      profile {\n        address\n        city\n        code\n        country\n        name\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  mutation register($credentials: InputRegisterCredentials!) {\n    register(credentials: $credentials) {\n      id\n      email\n      password\n      username\n      profile {\n        address\n        city\n        code\n        country\n        name\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation updateCustomers($updateCustomerArgs: [InputUpdateCustomerArgs!]!) {\n    updateCustomers(updateCustomerArgs: $updateCustomerArgs) {\n      id\n      email\n      name\n      phone\n    }\n  }\n": types.UpdateCustomersDocument,
    "\n  mutation updateEvents($updateEventsInput: [InputUpdateEventsArgs!]!) {\n    updateEvents(updateEventsInput: $updateEventsInput) {\n      id\n      start\n      end\n      title\n      variant\n      guests {\n        id\n        email\n        name\n        phone\n      }\n    }\n  }\n": types.UpdateEventsDocument,
    "\n  mutation updateInvoices($updateInvoicesArgs: [InputUpdateInvoicesArgs!]!) {\n    updateInvoices(updateInvoicesArgs: $updateInvoicesArgs) {\n      id\n      customer {\n        id\n        email\n        name\n        phone\n      }\n      description\n      status\n      items {\n        name\n        quantity\n        price\n      }\n      amount\n      due\n      emitted\n    }\n  }\n": types.UpdateInvoicesDocument,
    "\n  mutation updateUserProfile(\n    $updateUserProfileArgs: InputUpdateUserProfileArgs!\n  ) {\n    updateUserProfile(updateUserProfileArgs: $updateUserProfileArgs) {\n      id\n      email\n      password\n      username\n      profile {\n        address\n        city\n        code\n        country\n        name\n      }\n    }\n  }\n": types.UpdateUserProfileDocument,
    "\n  query countries {\n    countries {\n      name {\n        common\n        official\n      }\n    }\n  }\n": types.CountriesDocument,
    "\n  query getCustomers($filters: InputCustomersFilters = {}) {\n    customers(filters: $filters) {\n      id\n      email\n      name\n      phone\n    }\n  }\n": types.GetCustomersDocument,
    "\n  query events {\n    events {\n      id\n      start\n      end\n      title\n      variant\n      guests {\n        id\n        email\n        name\n        phone\n      }\n    }\n  }\n": types.EventsDocument,
    "\n  query invoices {\n    invoices {\n      id\n      customer {\n        id\n        email\n        name\n        phone\n      }\n      description\n      status\n      items {\n        name\n        quantity\n        price\n      }\n      amount\n      due\n      emitted\n    }\n  }\n": types.InvoicesDocument,
    "\n  query stats($filters: InputStatsFilters) {\n    stats(filters: $filters) {\n      pending {\n        name\n        value\n        change\n      }\n      overdue {\n        name\n        value\n        change\n      }\n      paid {\n        name\n        value\n        change\n      }\n    }\n  }\n": types.StatsDocument,
    "\n  query getUser {\n    user {\n      id\n      username\n      profile {\n        address\n        city\n        country\n        code\n        name\n      }\n    }\n  }\n": types.GetUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCustomers($createCustomerArgs: [InputCreateCustomerArgs!]!) {\n    createCustomers(createCustomerArgs: $createCustomerArgs) {\n      id\n      email\n      name\n      phone\n    }\n  }\n"): (typeof documents)["\n  mutation createCustomers($createCustomerArgs: [InputCreateCustomerArgs!]!) {\n    createCustomers(createCustomerArgs: $createCustomerArgs) {\n      id\n      email\n      name\n      phone\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createEvents($createEventsInput: [InputCreateEventsArgs!]!) {\n    createEvents(createEventsInput: $createEventsInput) {\n      id\n      start\n      end\n      title\n      variant\n      guests {\n        id\n        email\n        name\n        phone\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createEvents($createEventsInput: [InputCreateEventsArgs!]!) {\n    createEvents(createEventsInput: $createEventsInput) {\n      id\n      start\n      end\n      title\n      variant\n      guests {\n        id\n        email\n        name\n        phone\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createInvoices($createInvoicesArgs: [InputCreateInvoicesArgs!]!) {\n    createInvoices(createInvoicesArgs: $createInvoicesArgs) {\n      id\n      customer {\n        id\n        email\n        name\n        phone\n      }\n      description\n      status\n      items {\n        name\n        quantity\n        price\n      }\n      amount\n      due\n      emitted\n    }\n  }\n"): (typeof documents)["\n  mutation createInvoices($createInvoicesArgs: [InputCreateInvoicesArgs!]!) {\n    createInvoices(createInvoicesArgs: $createInvoicesArgs) {\n      id\n      customer {\n        id\n        email\n        name\n        phone\n      }\n      description\n      status\n      items {\n        name\n        quantity\n        price\n      }\n      amount\n      due\n      emitted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteCustomers($deleteCustomerArgs: [ID!]!) {\n    deleteCustomers(deleteCustomerArgs: $deleteCustomerArgs)\n  }\n"): (typeof documents)["\n  mutation deleteCustomers($deleteCustomerArgs: [ID!]!) {\n    deleteCustomers(deleteCustomerArgs: $deleteCustomerArgs)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteEvents($deleteEventsInput: [ID!]!) {\n    deleteEvents(deleteEventsInput: $deleteEventsInput)\n  }\n"): (typeof documents)["\n  mutation deleteEvents($deleteEventsInput: [ID!]!) {\n    deleteEvents(deleteEventsInput: $deleteEventsInput)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteInvoices($deleteInvoicesArgs: [ID!]!) {\n    deleteInvoices(deleteInvoicesArgs: $deleteInvoicesArgs)\n  }\n"): (typeof documents)["\n  mutation deleteInvoices($deleteInvoicesArgs: [ID!]!) {\n    deleteInvoices(deleteInvoicesArgs: $deleteInvoicesArgs)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($credentials: InputLoginCredentials!) {\n    login(credentials: $credentials) {\n      id\n      email\n      password\n      username\n      profile {\n        address\n        city\n        code\n        country\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation login($credentials: InputLoginCredentials!) {\n    login(credentials: $credentials) {\n      id\n      email\n      password\n      username\n      profile {\n        address\n        city\n        code\n        country\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation logout {\n    logout\n  }\n"): (typeof documents)["\n  mutation logout {\n    logout\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation register($credentials: InputRegisterCredentials!) {\n    register(credentials: $credentials) {\n      id\n      email\n      password\n      username\n      profile {\n        address\n        city\n        code\n        country\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation register($credentials: InputRegisterCredentials!) {\n    register(credentials: $credentials) {\n      id\n      email\n      password\n      username\n      profile {\n        address\n        city\n        code\n        country\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateCustomers($updateCustomerArgs: [InputUpdateCustomerArgs!]!) {\n    updateCustomers(updateCustomerArgs: $updateCustomerArgs) {\n      id\n      email\n      name\n      phone\n    }\n  }\n"): (typeof documents)["\n  mutation updateCustomers($updateCustomerArgs: [InputUpdateCustomerArgs!]!) {\n    updateCustomers(updateCustomerArgs: $updateCustomerArgs) {\n      id\n      email\n      name\n      phone\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateEvents($updateEventsInput: [InputUpdateEventsArgs!]!) {\n    updateEvents(updateEventsInput: $updateEventsInput) {\n      id\n      start\n      end\n      title\n      variant\n      guests {\n        id\n        email\n        name\n        phone\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateEvents($updateEventsInput: [InputUpdateEventsArgs!]!) {\n    updateEvents(updateEventsInput: $updateEventsInput) {\n      id\n      start\n      end\n      title\n      variant\n      guests {\n        id\n        email\n        name\n        phone\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateInvoices($updateInvoicesArgs: [InputUpdateInvoicesArgs!]!) {\n    updateInvoices(updateInvoicesArgs: $updateInvoicesArgs) {\n      id\n      customer {\n        id\n        email\n        name\n        phone\n      }\n      description\n      status\n      items {\n        name\n        quantity\n        price\n      }\n      amount\n      due\n      emitted\n    }\n  }\n"): (typeof documents)["\n  mutation updateInvoices($updateInvoicesArgs: [InputUpdateInvoicesArgs!]!) {\n    updateInvoices(updateInvoicesArgs: $updateInvoicesArgs) {\n      id\n      customer {\n        id\n        email\n        name\n        phone\n      }\n      description\n      status\n      items {\n        name\n        quantity\n        price\n      }\n      amount\n      due\n      emitted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateUserProfile(\n    $updateUserProfileArgs: InputUpdateUserProfileArgs!\n  ) {\n    updateUserProfile(updateUserProfileArgs: $updateUserProfileArgs) {\n      id\n      email\n      password\n      username\n      profile {\n        address\n        city\n        code\n        country\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateUserProfile(\n    $updateUserProfileArgs: InputUpdateUserProfileArgs!\n  ) {\n    updateUserProfile(updateUserProfileArgs: $updateUserProfileArgs) {\n      id\n      email\n      password\n      username\n      profile {\n        address\n        city\n        code\n        country\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query countries {\n    countries {\n      name {\n        common\n        official\n      }\n    }\n  }\n"): (typeof documents)["\n  query countries {\n    countries {\n      name {\n        common\n        official\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCustomers($filters: InputCustomersFilters = {}) {\n    customers(filters: $filters) {\n      id\n      email\n      name\n      phone\n    }\n  }\n"): (typeof documents)["\n  query getCustomers($filters: InputCustomersFilters = {}) {\n    customers(filters: $filters) {\n      id\n      email\n      name\n      phone\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query events {\n    events {\n      id\n      start\n      end\n      title\n      variant\n      guests {\n        id\n        email\n        name\n        phone\n      }\n    }\n  }\n"): (typeof documents)["\n  query events {\n    events {\n      id\n      start\n      end\n      title\n      variant\n      guests {\n        id\n        email\n        name\n        phone\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query invoices {\n    invoices {\n      id\n      customer {\n        id\n        email\n        name\n        phone\n      }\n      description\n      status\n      items {\n        name\n        quantity\n        price\n      }\n      amount\n      due\n      emitted\n    }\n  }\n"): (typeof documents)["\n  query invoices {\n    invoices {\n      id\n      customer {\n        id\n        email\n        name\n        phone\n      }\n      description\n      status\n      items {\n        name\n        quantity\n        price\n      }\n      amount\n      due\n      emitted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query stats($filters: InputStatsFilters) {\n    stats(filters: $filters) {\n      pending {\n        name\n        value\n        change\n      }\n      overdue {\n        name\n        value\n        change\n      }\n      paid {\n        name\n        value\n        change\n      }\n    }\n  }\n"): (typeof documents)["\n  query stats($filters: InputStatsFilters) {\n    stats(filters: $filters) {\n      pending {\n        name\n        value\n        change\n      }\n      overdue {\n        name\n        value\n        change\n      }\n      paid {\n        name\n        value\n        change\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getUser {\n    user {\n      id\n      username\n      profile {\n        address\n        city\n        country\n        code\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query getUser {\n    user {\n      id\n      username\n      profile {\n        address\n        city\n        country\n        code\n        name\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
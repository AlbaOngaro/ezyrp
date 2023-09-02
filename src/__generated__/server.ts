import { GraphQLResolveInfo } from 'graphql';
import { GraphqlContext } from '../pages/api/graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Customer = {
  __typename?: 'Customer';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

export type InputCreateCustomerArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type InputCreateInvoiceItems = {
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
};

export type InputCreateInvoicesArgs = {
  customer: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  due: Scalars['String']['input'];
  emitted: Scalars['String']['input'];
  items: Array<InputCreateInvoiceItems>;
  status: Scalars['String']['input'];
};

export type InputCustomersFilters = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
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

export type InputUpdateCustomerArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
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

export type Invoice = {
  __typename?: 'Invoice';
  amount: Scalars['Int']['output'];
  customer: Customer;
  description: Scalars['String']['output'];
  due: Scalars['String']['output'];
  emitted: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  items?: Maybe<Array<Item>>;
  status: Scalars['String']['output'];
};

export type Item = {
  __typename?: 'Item';
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCustomers?: Maybe<Array<Maybe<Customer>>>;
  createInvoices?: Maybe<Array<Maybe<Invoice>>>;
  deleteCustomers?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  deleteInvoices?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  login?: Maybe<User>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  register?: Maybe<User>;
  updateCustomers?: Maybe<Array<Maybe<Customer>>>;
  updateInvoices?: Maybe<Array<Maybe<Invoice>>>;
};


export type MutationCreateCustomersArgs = {
  createCustomerArgs: Array<InputCreateCustomerArgs>;
};


export type MutationCreateInvoicesArgs = {
  createInvoicesArgs: Array<InputCreateInvoicesArgs>;
};


export type MutationDeleteCustomersArgs = {
  deleteCustomerArgs: Array<Scalars['ID']['input']>;
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


export type MutationUpdateInvoicesArgs = {
  updateInvoicesArgs: Array<InputUpdateInvoicesArgs>;
};

export type Query = {
  __typename?: 'Query';
  customer?: Maybe<Customer>;
  customers?: Maybe<Array<Maybe<Customer>>>;
  invoice?: Maybe<Invoice>;
  invoices?: Maybe<Array<Maybe<Invoice>>>;
  user?: Maybe<User>;
};


export type QueryCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomersArgs = {
  filters?: InputMaybe<InputCustomersFilters>;
};


export type QueryInvoiceArgs = {
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  password: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Customer: ResolverTypeWrapper<Customer>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  InputCreateCustomerArgs: InputCreateCustomerArgs;
  InputCreateInvoiceItems: InputCreateInvoiceItems;
  InputCreateInvoicesArgs: InputCreateInvoicesArgs;
  InputCustomersFilters: InputCustomersFilters;
  InputLoginCredentials: InputLoginCredentials;
  InputRegisterCredentials: InputRegisterCredentials;
  InputUpdateCustomerArgs: InputUpdateCustomerArgs;
  InputUpdateInvoiceItems: InputUpdateInvoiceItems;
  InputUpdateInvoicesArgs: InputUpdateInvoicesArgs;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Invoice: ResolverTypeWrapper<Invoice>;
  Item: ResolverTypeWrapper<Item>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  Customer: Customer;
  ID: Scalars['ID']['output'];
  InputCreateCustomerArgs: InputCreateCustomerArgs;
  InputCreateInvoiceItems: InputCreateInvoiceItems;
  InputCreateInvoicesArgs: InputCreateInvoicesArgs;
  InputCustomersFilters: InputCustomersFilters;
  InputLoginCredentials: InputLoginCredentials;
  InputRegisterCredentials: InputRegisterCredentials;
  InputUpdateCustomerArgs: InputUpdateCustomerArgs;
  InputUpdateInvoiceItems: InputUpdateInvoiceItems;
  InputUpdateInvoicesArgs: InputUpdateInvoicesArgs;
  Int: Scalars['Int']['output'];
  Invoice: Invoice;
  Item: Item;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  User: User;
}>;

export type CustomerResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InvoiceResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Invoice'] = ResolversParentTypes['Invoice']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  customer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  due?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emitted?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes['Item']>>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ItemResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Item'] = ResolversParentTypes['Item']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createCustomers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customer']>>>, ParentType, ContextType, RequireFields<MutationCreateCustomersArgs, 'createCustomerArgs'>>;
  createInvoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['Invoice']>>>, ParentType, ContextType, RequireFields<MutationCreateInvoicesArgs, 'createInvoicesArgs'>>;
  deleteCustomers?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType, RequireFields<MutationDeleteCustomersArgs, 'deleteCustomerArgs'>>;
  deleteInvoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType, RequireFields<MutationDeleteInvoicesArgs, 'deleteInvoicesArgs'>>;
  login?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationLoginArgs>>;
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  register?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationRegisterArgs>>;
  updateCustomers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customer']>>>, ParentType, ContextType, RequireFields<MutationUpdateCustomersArgs, 'updateCustomerArgs'>>;
  updateInvoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['Invoice']>>>, ParentType, ContextType, RequireFields<MutationUpdateInvoicesArgs, 'updateInvoicesArgs'>>;
}>;

export type QueryResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryCustomerArgs, 'id'>>;
  customers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customer']>>>, ParentType, ContextType, Partial<QueryCustomersArgs>>;
  invoice?: Resolver<Maybe<ResolversTypes['Invoice']>, ParentType, ContextType, RequireFields<QueryInvoiceArgs, 'id'>>;
  invoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['Invoice']>>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphqlContext> = ResolversObject<{
  Customer?: CustomerResolvers<ContextType>;
  Invoice?: InvoiceResolvers<ContextType>;
  Item?: ItemResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;


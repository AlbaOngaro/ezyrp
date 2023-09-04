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
  items?: Maybe<Array<Item>>;
  status: Scalars['String']['output'];
};

export type Item = {
  __typename?: 'Item';
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
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
  customers: Array<Customer>;
  event: Event;
  events: Array<Event>;
  getCloudinarySignature: CloudinarySignature;
  invoice: Invoice;
  invoices: Array<Invoice>;
  stats: Stats;
  user?: Maybe<User>;
};


export type QueryCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomersArgs = {
  filters?: InputMaybe<InputCustomersFilters>;
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStatsArgs = {
  filters?: InputMaybe<InputStatsFilters>;
};

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
  CloudinarySignature: ResolverTypeWrapper<CloudinarySignature>;
  Country: ResolverTypeWrapper<Country>;
  CountryName: ResolverTypeWrapper<CountryName>;
  Customer: ResolverTypeWrapper<Customer>;
  Event: ResolverTypeWrapper<Event>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Guest: ResolverTypeWrapper<Guest>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  InputCreateCustomerArgs: InputCreateCustomerArgs;
  InputCreateEventsArgs: InputCreateEventsArgs;
  InputCreateInvoiceItems: InputCreateInvoiceItems;
  InputCreateInvoicesArgs: InputCreateInvoicesArgs;
  InputCustomersFilters: InputCustomersFilters;
  InputLoginCredentials: InputLoginCredentials;
  InputRegisterCredentials: InputRegisterCredentials;
  InputStatsFilters: InputStatsFilters;
  InputUpdateCustomerArgs: InputUpdateCustomerArgs;
  InputUpdateEventsArgs: InputUpdateEventsArgs;
  InputUpdateInvoiceItems: InputUpdateInvoiceItems;
  InputUpdateInvoicesArgs: InputUpdateInvoicesArgs;
  InputUpdateUserProfileArgs: InputUpdateUserProfileArgs;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Invoice: ResolverTypeWrapper<Invoice>;
  Item: ResolverTypeWrapper<Item>;
  LastInvoice: ResolverTypeWrapper<LastInvoice>;
  Mutation: ResolverTypeWrapper<{}>;
  Profile: ResolverTypeWrapper<Profile>;
  Query: ResolverTypeWrapper<{}>;
  Stat: ResolverTypeWrapper<Stat>;
  Stats: ResolverTypeWrapper<Stats>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CloudinarySignature: CloudinarySignature;
  Country: Country;
  CountryName: CountryName;
  Customer: Customer;
  Event: Event;
  Float: Scalars['Float']['output'];
  Guest: Guest;
  ID: Scalars['ID']['output'];
  InputCreateCustomerArgs: InputCreateCustomerArgs;
  InputCreateEventsArgs: InputCreateEventsArgs;
  InputCreateInvoiceItems: InputCreateInvoiceItems;
  InputCreateInvoicesArgs: InputCreateInvoicesArgs;
  InputCustomersFilters: InputCustomersFilters;
  InputLoginCredentials: InputLoginCredentials;
  InputRegisterCredentials: InputRegisterCredentials;
  InputStatsFilters: InputStatsFilters;
  InputUpdateCustomerArgs: InputUpdateCustomerArgs;
  InputUpdateEventsArgs: InputUpdateEventsArgs;
  InputUpdateInvoiceItems: InputUpdateInvoiceItems;
  InputUpdateInvoicesArgs: InputUpdateInvoicesArgs;
  InputUpdateUserProfileArgs: InputUpdateUserProfileArgs;
  Int: Scalars['Int']['output'];
  Invoice: Invoice;
  Item: Item;
  LastInvoice: LastInvoice;
  Mutation: {};
  Profile: Profile;
  Query: {};
  Stat: Stat;
  Stats: Stats;
  String: Scalars['String']['output'];
  User: User;
}>;

export type CloudinarySignatureResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['CloudinarySignature'] = ResolversParentTypes['CloudinarySignature']> = ResolversObject<{
  apiKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cloudname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  signature?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CountryResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Country'] = ResolversParentTypes['Country']> = ResolversObject<{
  name?: Resolver<ResolversTypes['CountryName'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CountryNameResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['CountryName'] = ResolversParentTypes['CountryName']> = ResolversObject<{
  common?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  official?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastInvoice?: Resolver<Maybe<ResolversTypes['LastInvoice']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = ResolversObject<{
  end?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  guests?: Resolver<Array<ResolversTypes['Guest']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  start?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  variant?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GuestResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Guest'] = ResolversParentTypes['Guest']> = ResolversObject<{
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

export type LastInvoiceResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['LastInvoice'] = ResolversParentTypes['LastInvoice']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  emitted?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createCustomers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customer']>>>, ParentType, ContextType, RequireFields<MutationCreateCustomersArgs, 'createCustomerArgs'>>;
  createEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Event']>>>, ParentType, ContextType, RequireFields<MutationCreateEventsArgs, 'createEventsInput'>>;
  createInvoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['Invoice']>>>, ParentType, ContextType, RequireFields<MutationCreateInvoicesArgs, 'createInvoicesArgs'>>;
  deleteCustomers?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType, RequireFields<MutationDeleteCustomersArgs, 'deleteCustomerArgs'>>;
  deleteEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType, RequireFields<MutationDeleteEventsArgs, 'deleteEventsInput'>>;
  deleteInvoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType, RequireFields<MutationDeleteInvoicesArgs, 'deleteInvoicesArgs'>>;
  login?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationLoginArgs>>;
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  register?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationRegisterArgs>>;
  updateCustomers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customer']>>>, ParentType, ContextType, RequireFields<MutationUpdateCustomersArgs, 'updateCustomerArgs'>>;
  updateEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Event']>>>, ParentType, ContextType, RequireFields<MutationUpdateEventsArgs, 'updateEventsInput'>>;
  updateInvoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['Invoice']>>>, ParentType, ContextType, RequireFields<MutationUpdateInvoicesArgs, 'updateInvoicesArgs'>>;
  updateUserProfile?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserProfileArgs, 'updateUserProfileArgs'>>;
}>;

export type ProfileResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  countries?: Resolver<Array<ResolversTypes['Country']>, ParentType, ContextType>;
  customer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<QueryCustomerArgs, 'id'>>;
  customers?: Resolver<Array<ResolversTypes['Customer']>, ParentType, ContextType, Partial<QueryCustomersArgs>>;
  event?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<QueryEventArgs, 'id'>>;
  events?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType>;
  getCloudinarySignature?: Resolver<ResolversTypes['CloudinarySignature'], ParentType, ContextType>;
  invoice?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType, RequireFields<QueryInvoiceArgs, 'id'>>;
  invoices?: Resolver<Array<ResolversTypes['Invoice']>, ParentType, ContextType>;
  stats?: Resolver<ResolversTypes['Stats'], ParentType, ContextType, Partial<QueryStatsArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type StatResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Stat'] = ResolversParentTypes['Stat']> = ResolversObject<{
  change?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatsResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['Stats'] = ResolversParentTypes['Stats']> = ResolversObject<{
  overdue?: Resolver<ResolversTypes['Stat'], ParentType, ContextType>;
  paid?: Resolver<ResolversTypes['Stat'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Stat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GraphqlContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphqlContext> = ResolversObject<{
  CloudinarySignature?: CloudinarySignatureResolvers<ContextType>;
  Country?: CountryResolvers<ContextType>;
  CountryName?: CountryNameResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  Guest?: GuestResolvers<ContextType>;
  Invoice?: InvoiceResolvers<ContextType>;
  Item?: ItemResolvers<ContextType>;
  LastInvoice?: LastInvoiceResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Stat?: StatResolvers<ContextType>;
  Stats?: StatsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;


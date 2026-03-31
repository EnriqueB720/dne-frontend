import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Category = {
  __typename?: 'Category';
  categoryId: Scalars['Float']['output'];
  categoryName: Scalars['String']['output'];
};

export type CategoryCreateInput = {
  categoryName: Scalars['String']['input'];
};

export type CategoryWhereInput = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
};

/** Supported languages for users */
export enum Language {
  English = 'ENGLISH',
  Spanish = 'SPANISH'
}

export type LoginOutput = {
  __typename?: 'LoginOutput';
  access_token: Scalars['String']['output'];
  expiresAt: Scalars['DateTime']['output'];
  user: User;
};

export type LoginUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: Category;
  createPost: Post;
  createPricing: Pricing;
  createSubscription: Subscription;
  createSupplier: Supplier;
  createUser: User;
  deletePost: Scalars['Boolean']['output'];
  signup: User;
  updatePost: Post;
};


export type MutationCreateCategoryArgs = {
  data: CategoryCreateInput;
};


export type MutationCreatePostArgs = {
  data: PostCreateInput;
};


export type MutationCreatePricingArgs = {
  data: PricingCreateInput;
};


export type MutationCreateSubscriptionArgs = {
  data: SubscriptionCreateInput;
};


export type MutationCreateSupplierArgs = {
  data: SupplierCreateInput;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationDeletePostArgs = {
  whereUnique: PostWhereUniqueInput;
};


export type MutationSignupArgs = {
  data: SignUpInput;
};


export type MutationUpdatePostArgs = {
  data: PostUpdateInput;
  where?: InputMaybe<PostWhereInput>;
  whereUnique?: InputMaybe<PostWhereUniqueInput>;
};

export type Post = {
  __typename?: 'Post';
  category: Category;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  media_url: Scalars['String']['output'];
  postId: Scalars['Float']['output'];
  price: Scalars['String']['output'];
  supplier: Supplier;
  title: Scalars['String']['output'];
};

export type PostCreateInput = {
  categoryId: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  mediaUrl: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  supplierId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type PostUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  mediaUrl?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PostWhereInput = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  postId?: InputMaybe<Scalars['Int']['input']>;
  supplierId?: InputMaybe<Scalars['Int']['input']>;
};

export type PostWhereUniqueInput = {
  postId: Scalars['Int']['input'];
};

export type Pricing = {
  __typename?: 'Pricing';
  features: Scalars['String']['output'];
  planId: Scalars['Float']['output'];
  planName: Scalars['String']['output'];
  price: Scalars['String']['output'];
};

export type PricingCreateInput = {
  features: Scalars['String']['input'];
  planName: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type PricingWhereInput = {
  planId?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  category: Category;
  login: LoginOutput;
  post: Post;
  postsBySupplier: Array<Post>;
  pricing: Pricing;
  refreshUser: LoginOutput;
  search: Search;
  subscription: Subscription;
  supplier: Supplier;
  user: User;
};


export type QueryCategoryArgs = {
  where: CategoryWhereInput;
};


export type QueryLoginArgs = {
  data: LoginUserInput;
};


export type QueryPostArgs = {
  where?: InputMaybe<PostWhereInput>;
  whereUnique?: InputMaybe<PostWhereUniqueInput>;
};


export type QueryPostsBySupplierArgs = {
  where?: InputMaybe<PostWhereInput>;
  whereUnique?: InputMaybe<PostWhereUniqueInput>;
};


export type QueryPricingArgs = {
  where: PricingWhereInput;
};


export type QueryRefreshUserArgs = {
  data: Scalars['String']['input'];
};


export type QuerySearchArgs = {
  query?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
};


export type QuerySubscriptionArgs = {
  where: SubscriptionWhereInput;
};


export type QuerySupplierArgs = {
  where: SupplierWhereInput;
};


export type QueryUserArgs = {
  where: UserWhereInput;
};

/** Supported roles for users */
export enum Role {
  Admin = 'ADMIN',
  Supplier = 'SUPPLIER'
}

export type Search = {
  __typename?: 'Search';
  post?: Maybe<Array<Post>>;
};

export type SignUpInput = {
  companyName: Scalars['String']['input'];
  country: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  profilePicture?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  endDate: Scalars['DateTime']['output'];
  plan?: Maybe<Pricing>;
  planId: Scalars['Float']['output'];
  startDate: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
  subscriptionId: Scalars['Float']['output'];
  user?: Maybe<User>;
  userId: Scalars['Float']['output'];
};

export type SubscriptionCreateInput = {
  endDate: Scalars['DateTime']['input'];
  planId: Scalars['Float']['input'];
  startDate: Scalars['DateTime']['input'];
  status: Scalars['String']['input'];
  userId: Scalars['Float']['input'];
};

export type SubscriptionCreateNestedInput = {
  endDate: Scalars['DateTime']['input'];
  planId: Scalars['Int']['input'];
  startDate: Scalars['DateTime']['input'];
  status: Scalars['String']['input'];
};

export type SubscriptionWhereInput = {
  subscriptionId?: InputMaybe<Scalars['Int']['input']>;
};

export type Supplier = {
  __typename?: 'Supplier';
  companyName: Scalars['String']['output'];
  posts?: Maybe<Array<Post>>;
  supplierId: Scalars['Float']['output'];
  user?: Maybe<User>;
};

export type SupplierCreateInput = {
  companyName: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['Float']['input']>;
};

export type SupplierWhereInput = {
  supplierId?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  country: Scalars['String']['output'];
  email: Scalars['String']['output'];
  language: Language;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  profilePicture: Scalars['String']['output'];
  role: Role;
  subscription?: Maybe<Array<Subscription>>;
  supplier?: Maybe<Array<Supplier>>;
  userId: Scalars['Float']['output'];
};

export type UserCreateInput = {
  companyName: Scalars['String']['input'];
  country: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  role: Role;
  subscription: SubscriptionCreateNestedInput;
};

export type UserWhereInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type LoginQueryVariables = Exact<{
  data: LoginUserInput;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, email: string, language: Language, country: string, name: string, phone: string, role: Role, profilePicture: string, subscription?: Array<{ __typename?: 'Subscription', subscriptionId: number, startDate: any, endDate: any, plan?: { __typename?: 'Pricing', planId: number, planName: string, price: string } | null }> | null, supplier?: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string }> | null } } };

export type RefreshUserQueryVariables = Exact<{
  data: Scalars['String']['input'];
}>;


export type RefreshUserQuery = { __typename?: 'Query', refreshUser: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, email: string, language: Language, country: string, name: string, phone: string, role: Role, profilePicture: string, subscription?: Array<{ __typename?: 'Subscription', subscriptionId: number, startDate: any, endDate: any, plan?: { __typename?: 'Pricing', planId: number, planName: string, price: string } | null }> | null, supplier?: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string }> | null } } };

export type SignupMutationVariables = Exact<{
  data: SignUpInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'User', userId: number } };


export const LoginDocument = gql`
    query login($data: LoginUserInput!) {
  login(data: $data) {
    access_token
    expiresAt
    user {
      userId
      email
      language
      country
      name
      phone
      role
      profilePicture
      subscription {
        subscriptionId
        plan {
          planId
          planName
          price
        }
        startDate
        endDate
      }
      supplier {
        supplierId
        companyName
      }
    }
  }
}
    `;

/**
 * __useLoginQuery__
 *
 * To run a query within a React component, call `useLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginQuery(baseOptions: Apollo.QueryHookOptions<LoginQuery, LoginQueryVariables> & ({ variables: LoginQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
      }
export function useLoginLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
// @ts-ignore
export function useLoginSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LoginQuery, LoginQueryVariables>): Apollo.UseSuspenseQueryResult<LoginQuery, LoginQueryVariables>;
export function useLoginSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LoginQuery, LoginQueryVariables>): Apollo.UseSuspenseQueryResult<LoginQuery | undefined, LoginQueryVariables>;
export function useLoginSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
export type LoginQueryHookResult = ReturnType<typeof useLoginQuery>;
export type LoginLazyQueryHookResult = ReturnType<typeof useLoginLazyQuery>;
export type LoginSuspenseQueryHookResult = ReturnType<typeof useLoginSuspenseQuery>;
export type LoginQueryResult = Apollo.QueryResult<LoginQuery, LoginQueryVariables>;
export const RefreshUserDocument = gql`
    query refreshUser($data: String!) {
  refreshUser(data: $data) {
    access_token
    expiresAt
    user {
      userId
      email
      language
      country
      name
      phone
      role
      profilePicture
      subscription {
        subscriptionId
        plan {
          planId
          planName
          price
        }
        startDate
        endDate
      }
      supplier {
        supplierId
        companyName
      }
    }
  }
}
    `;

/**
 * __useRefreshUserQuery__
 *
 * To run a query within a React component, call `useRefreshUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useRefreshUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRefreshUserQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRefreshUserQuery(baseOptions: Apollo.QueryHookOptions<RefreshUserQuery, RefreshUserQueryVariables> & ({ variables: RefreshUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RefreshUserQuery, RefreshUserQueryVariables>(RefreshUserDocument, options);
      }
export function useRefreshUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RefreshUserQuery, RefreshUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RefreshUserQuery, RefreshUserQueryVariables>(RefreshUserDocument, options);
        }
// @ts-ignore
export function useRefreshUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RefreshUserQuery, RefreshUserQueryVariables>): Apollo.UseSuspenseQueryResult<RefreshUserQuery, RefreshUserQueryVariables>;
export function useRefreshUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RefreshUserQuery, RefreshUserQueryVariables>): Apollo.UseSuspenseQueryResult<RefreshUserQuery | undefined, RefreshUserQueryVariables>;
export function useRefreshUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RefreshUserQuery, RefreshUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RefreshUserQuery, RefreshUserQueryVariables>(RefreshUserDocument, options);
        }
export type RefreshUserQueryHookResult = ReturnType<typeof useRefreshUserQuery>;
export type RefreshUserLazyQueryHookResult = ReturnType<typeof useRefreshUserLazyQuery>;
export type RefreshUserSuspenseQueryHookResult = ReturnType<typeof useRefreshUserSuspenseQuery>;
export type RefreshUserQueryResult = Apollo.QueryResult<RefreshUserQuery, RefreshUserQueryVariables>;
export const SignupDocument = gql`
    mutation signup($data: SignUpInput!) {
  signup(data: $data) {
    userId
  }
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
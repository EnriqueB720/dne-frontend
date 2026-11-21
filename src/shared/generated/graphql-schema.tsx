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

export type AdminCount = {
  __typename?: 'AdminCount';
  count: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
};

export type AdminDailyRow = {
  __typename?: 'AdminDailyRow';
  contacts: Scalars['Int']['output'];
  day: Scalars['String']['output'];
  newCustomers: Scalars['Int']['output'];
  newSuppliers: Scalars['Int']['output'];
};

export type AdminOverview = {
  __typename?: 'AdminOverview';
  contactsByChannel: Array<AdminCount>;
  daily: Array<AdminDailyRow>;
  days: Scalars['Int']['output'];
  suppliersByProvince: Array<AdminCount>;
  topSuppliers: Array<AdminTopSupplier>;
  totals: AdminTotals;
};

export type AdminPreferredInput = {
  preferred: Scalars['Boolean']['input'];
  supplierId: Scalars['Int']['input'];
  until?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AdminSupplierFilter = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<AdminSupplierStatus>;
};

export type AdminSupplierPage = {
  __typename?: 'AdminSupplierPage';
  rows: Array<AdminSupplierRow>;
  total: Scalars['Int']['output'];
};

export type AdminSupplierRow = {
  __typename?: 'AdminSupplierRow';
  businessEmail?: Maybe<Scalars['String']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  categories: Array<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  companyName: Scalars['String']['output'];
  contactsLast30Days: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  ownerEmail: Scalars['String']['output'];
  ownerName: Scalars['String']['output'];
  preferred: Scalars['Boolean']['output'];
  preferredAt?: Maybe<Scalars['DateTime']['output']>;
  preferredUntil?: Maybe<Scalars['DateTime']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  provinceName?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['String']['output']>;
  reviewCount: Scalars['Int']['output'];
  source: Scalars['String']['output'];
  supplierId: Scalars['Int']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
  whatsappNumber?: Maybe<Scalars['String']['output']>;
};

export enum AdminSupplierStatus {
  All = 'ALL',
  Preferred = 'PREFERRED',
  Unverified = 'UNVERIFIED',
  Verified = 'VERIFIED'
}

export type AdminTopSupplier = {
  __typename?: 'AdminTopSupplier';
  companyName: Scalars['String']['output'];
  contacts: Scalars['Int']['output'];
  provinceName?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['String']['output']>;
  supplierId: Scalars['Int']['output'];
};

export type AdminTotals = {
  __typename?: 'AdminTotals';
  chats: Scalars['Int']['output'];
  contacts: Scalars['Int']['output'];
  customers: Scalars['Int']['output'];
  newCustomers: Scalars['Int']['output'];
  newSuppliers: Scalars['Int']['output'];
  pendingVerification: Scalars['Int']['output'];
  preferredSuppliers: Scalars['Int']['output'];
  suppliers: Scalars['Int']['output'];
  uniqueContacters: Scalars['Int']['output'];
  verifiedSuppliers: Scalars['Int']['output'];
};

export type AiChatMessageInput = {
  content: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export type AiCompletionInput = {
  cachedSystem?: InputMaybe<Scalars['String']['input']>;
  messages: Array<AiChatMessageInput>;
  system?: InputMaybe<Scalars['String']['input']>;
};

export type AiCompletionResult = {
  __typename?: 'AiCompletionResult';
  content: Scalars['String']['output'];
  model: Scalars['String']['output'];
  usage?: Maybe<AiMessageUsage>;
};

export type AiConversation = {
  __typename?: 'AiConversation';
  conversationId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deviceId: Scalars['String']['output'];
  messages?: Maybe<Array<AiMessage>>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId?: Maybe<Scalars['Float']['output']>;
};

export type AiConversationCreateInput = {
  deviceId?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type AiConversationUpdateInput = {
  conversationId: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type AiMessage = {
  __typename?: 'AiMessage';
  content: Scalars['String']['output'];
  conversationId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  messageId: Scalars['String']['output'];
  model?: Maybe<Scalars['String']['output']>;
  providersJson?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
};

export type AiMessageProvidersUpdateInput = {
  conversationId: Scalars['String']['input'];
  messageId: Scalars['String']['input'];
  providersJson: Scalars['String']['input'];
};

export type AiMessageSendInput = {
  cachedSystem?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  conversationId: Scalars['String']['input'];
  system?: InputMaybe<Scalars['String']['input']>;
};

export type AiMessageUsage = {
  __typename?: 'AiMessageUsage';
  inputTokens?: Maybe<Scalars['Float']['output']>;
  outputTokens?: Maybe<Scalars['Float']['output']>;
};

export type Category = {
  __typename?: 'Category';
  categoryId: Scalars['Int']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  nameEn: Scalars['String']['output'];
  nameEs: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type CompleteOnboardingInput = {
  companyName?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  role: Scalars['String']['input'];
};

/** How a customer reached out to a supplier */
export enum ContactChannel {
  ChatContact = 'CHAT_CONTACT',
  Email = 'EMAIL',
  Phone = 'PHONE',
  Website = 'WEBSITE',
  Whatsapp = 'WHATSAPP'
}

export type ContactChannelCount = {
  __typename?: 'ContactChannelCount';
  channel: Scalars['String']['output'];
  count: Scalars['Int']['output'];
};

export type ContactLogInput = {
  channel: ContactChannel;
  deviceId?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  supplierId: Scalars['Int']['input'];
};

export type Customer = {
  __typename?: 'Customer';
  customerId: Scalars['Int']['output'];
  userId?: Maybe<Scalars['Int']['output']>;
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

export type MediaAsset = {
  __typename?: 'MediaAsset';
  altText?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  mediaAssetId: Scalars['Int']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminSetSupplierPreferred: Scalars['Boolean']['output'];
  adminSetSupplierVerified: Scalars['Boolean']['output'];
  aiComplete: AiCompletionResult;
  completeOnboarding: LoginOutput;
  createAiConversation: AiConversation;
  deleteAiConversation: Scalars['Boolean']['output'];
  deleteMyService: Scalars['Boolean']['output'];
  deleteMySupplierMedia: Scalars['Boolean']['output'];
  deleteReview: Scalars['Boolean']['output'];
  dismissReviewPrompt: Scalars['Boolean']['output'];
  logSupplierContact: Scalars['Boolean']['output'];
  mergeGuestAiConversations: Scalars['Float']['output'];
  mergeGuestContacts: Scalars['Int']['output'];
  reorderMySupplierMedia: Scalars['Boolean']['output'];
  requestPasswordReset: PasswordResetResult;
  resetPassword: PasswordResetResult;
  rollbackLastAiTurn: Scalars['Float']['output'];
  saveMyService: Service;
  saveReview: ReviewView;
  sendAiMessage: SendAiMessageResult;
  setMySupplierCategories: Scalars['Boolean']['output'];
  setMySupplierSkills: Array<Scalars['String']['output']>;
  signup: User;
  socialLogin: LoginOutput;
  updateAiConversation: AiConversation;
  updateAiMessageProviders: AiMessage;
  updateMe: User;
  updateMySupplier: Supplier;
};


export type MutationAdminSetSupplierPreferredArgs = {
  data: AdminPreferredInput;
};


export type MutationAdminSetSupplierVerifiedArgs = {
  supplierId: Scalars['Int']['input'];
  verified: Scalars['Boolean']['input'];
};


export type MutationAiCompleteArgs = {
  data: AiCompletionInput;
};


export type MutationCompleteOnboardingArgs = {
  data: CompleteOnboardingInput;
};


export type MutationCreateAiConversationArgs = {
  data: AiConversationCreateInput;
};


export type MutationDeleteAiConversationArgs = {
  conversationId: Scalars['String']['input'];
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteMyServiceArgs = {
  serviceId: Scalars['Int']['input'];
};


export type MutationDeleteMySupplierMediaArgs = {
  mediaAssetId: Scalars['Int']['input'];
};


export type MutationDeleteReviewArgs = {
  reviewId: Scalars['Int']['input'];
};


export type MutationDismissReviewPromptArgs = {
  supplierId: Scalars['Int']['input'];
};


export type MutationLogSupplierContactArgs = {
  data: ContactLogInput;
};


export type MutationMergeGuestAiConversationsArgs = {
  deviceId: Scalars['String']['input'];
};


export type MutationMergeGuestContactsArgs = {
  deviceId: Scalars['String']['input'];
};


export type MutationReorderMySupplierMediaArgs = {
  mediaAssetIds: Array<Scalars['Int']['input']>;
};


export type MutationRequestPasswordResetArgs = {
  data: RequestPasswordResetInput;
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInput;
};


export type MutationRollbackLastAiTurnArgs = {
  conversationId: Scalars['String']['input'];
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSaveMyServiceArgs = {
  data: ServiceInput;
};


export type MutationSaveReviewArgs = {
  data: ReviewInput;
};


export type MutationSendAiMessageArgs = {
  data: AiMessageSendInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSetMySupplierCategoriesArgs = {
  data: SupplierCategoriesInput;
};


export type MutationSetMySupplierSkillsArgs = {
  skills: Array<Scalars['String']['input']>;
};


export type MutationSignupArgs = {
  data: SignUpInput;
};


export type MutationSocialLoginArgs = {
  data: SocialLoginInput;
};


export type MutationUpdateAiConversationArgs = {
  data: AiConversationUpdateInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateAiMessageProvidersArgs = {
  data: AiMessageProvidersUpdateInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateMeArgs = {
  data: UserUpdateInput;
};


export type MutationUpdateMySupplierArgs = {
  data: SupplierUpdateInput;
};

export type PasswordResetResult = {
  __typename?: 'PasswordResetResult';
  ok: Scalars['Boolean']['output'];
  resetUrl?: Maybe<Scalars['String']['output']>;
};

/** A province / state (ISO 3166-2) */
export type Province = {
  __typename?: 'Province';
  code: Scalars['String']['output'];
  country: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  adminOverview: AdminOverview;
  adminSuppliers: AdminSupplierPage;
  aiConversation: AiConversation;
  aiConversations: Array<AiConversation>;
  aiMessages: Array<AiMessage>;
  categories: Array<Category>;
  login: LoginOutput;
  me: User;
  mySavedContacts: Array<SavedContact>;
  mySupplier: Supplier;
  mySupplierStats: SupplierStats;
  provinces: Array<Province>;
  refreshUser: LoginOutput;
  resolveProvince?: Maybe<ResolvedProvince>;
  reviewPrompts: Array<ReviewPrompt>;
  searchSuppliers: SupplierSearchResult;
  suggestMySupplierSkills: Array<Scalars['String']['output']>;
  supplier: Supplier;
  supplierReviews: Array<ReviewView>;
  suppliers: Array<Supplier>;
};


export type QueryAdminOverviewArgs = {
  days?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAdminSuppliersArgs = {
  filter?: InputMaybe<AdminSupplierFilter>;
};


export type QueryAiConversationArgs = {
  conversationId: Scalars['String']['input'];
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAiConversationsArgs = {
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAiMessagesArgs = {
  conversationId: Scalars['String']['input'];
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLoginArgs = {
  data: LoginUserInput;
};


export type QueryProvincesArgs = {
  country?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRefreshUserArgs = {
  data: Scalars['String']['input'];
};


export type QueryResolveProvinceArgs = {
  lat?: InputMaybe<Scalars['Float']['input']>;
  lng?: InputMaybe<Scalars['Float']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchSuppliersArgs = {
  data: SupplierSearchInput;
};


export type QuerySupplierArgs = {
  supplierId: Scalars['Int']['input'];
};


export type QuerySupplierReviewsArgs = {
  supplierId: Scalars['Int']['input'];
};


export type QuerySuppliersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
};

export type RequestPasswordResetInput = {
  email: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

/** A province worked out from text or device coordinates */
export type ResolvedProvince = {
  __typename?: 'ResolvedProvince';
  code: Scalars['String']['output'];
  country: Scalars['String']['output'];
  name: Scalars['String']['output'];
  source: Scalars['String']['output'];
};

export type ReviewInput = {
  rating: Scalars['Int']['input'];
  supplierId: Scalars['Int']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
};

export type ReviewPrompt = {
  __typename?: 'ReviewPrompt';
  city?: Maybe<Scalars['String']['output']>;
  companyName: Scalars['String']['output'];
  contactedAt: Scalars['DateTime']['output'];
  supplierId: Scalars['Int']['output'];
};

export type ReviewView = {
  __typename?: 'ReviewView';
  createdAt: Scalars['DateTime']['output'];
  isMine: Scalars['Boolean']['output'];
  rating: Scalars['Int']['output'];
  reviewId: Scalars['Int']['output'];
  reviewerName: Scalars['String']['output'];
  supplierId: Scalars['Int']['output'];
  text?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type SavedContact = {
  __typename?: 'SavedContact';
  businessEmail?: Maybe<Scalars['String']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  companyName: Scalars['String']['output'];
  contactCount: Scalars['Int']['output'];
  lastChannel: Scalars['String']['output'];
  lastContactedAt: Scalars['DateTime']['output'];
  myRating?: Maybe<Scalars['Int']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  supplierId: Scalars['Int']['output'];
  websiteUrl?: Maybe<Scalars['String']['output']>;
  whatsappNumber?: Maybe<Scalars['String']['output']>;
};

export type SendAiMessageResult = {
  __typename?: 'SendAiMessageResult';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  messageId: Scalars['String']['output'];
  model: Scalars['String']['output'];
  role: Scalars['String']['output'];
  usage?: Maybe<AiMessageUsage>;
};

export type Service = {
  __typename?: 'Service';
  currency: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  priceFrom?: Maybe<Scalars['String']['output']>;
  priceUnit?: Maybe<Scalars['String']['output']>;
  serviceId: Scalars['Int']['output'];
  supplierId: Scalars['Int']['output'];
};

export type ServiceInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  priceFrom?: InputMaybe<Scalars['String']['input']>;
  priceUnit?: InputMaybe<Scalars['String']['input']>;
  serviceId?: InputMaybe<Scalars['Int']['input']>;
};

export type SignUpInput = {
  companyName?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type SocialLoginInput = {
  provider: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Supplier = {
  __typename?: 'Supplier';
  address?: Maybe<Scalars['String']['output']>;
  businessEmail?: Maybe<Scalars['String']['output']>;
  businessEmailAlt?: Maybe<Scalars['String']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  businessPhoneAlt?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<Array<SupplierCategory>>;
  city?: Maybe<Scalars['String']['output']>;
  claimedAt?: Maybe<Scalars['DateTime']['output']>;
  companyName: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  media?: Maybe<Array<MediaAsset>>;
  preferred: Scalars['Boolean']['output'];
  preferredAt?: Maybe<Scalars['DateTime']['output']>;
  preferredUntil?: Maybe<Scalars['DateTime']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  provinceName?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['String']['output']>;
  reviewCount?: Maybe<Scalars['Int']['output']>;
  serviceProvinceNames: Array<Scalars['String']['output']>;
  serviceProvinces?: Maybe<Array<Scalars['String']['output']>>;
  services?: Maybe<Array<Service>>;
  skills?: Maybe<Array<Scalars['String']['output']>>;
  source?: Maybe<SupplierSource>;
  supplierId: Scalars['Int']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  verified: Scalars['Boolean']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
  whatsappNumber?: Maybe<Scalars['String']['output']>;
};

export type SupplierCategoriesInput = {
  categoryIds: Array<Scalars['Int']['input']>;
  primaryCategoryId?: InputMaybe<Scalars['Int']['input']>;
};

export type SupplierCategory = {
  __typename?: 'SupplierCategory';
  category?: Maybe<Category>;
  categoryId: Scalars['Int']['output'];
  isPrimary: Scalars['Boolean']['output'];
  supplierId: Scalars['Int']['output'];
};

export type SupplierSearchInput = {
  categorySlug?: InputMaybe<Scalars['String']['input']>;
  lat?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  lng?: InputMaybe<Scalars['Float']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};

/** Chat search: who serves the requested zone */
export type SupplierSearchResult = {
  __typename?: 'SupplierSearchResult';
  province?: Maybe<ResolvedProvince>;
  suppliers: Array<Supplier>;
};

/** How the supplier row was created */
export enum SupplierSource {
  GooglePlaces = 'GOOGLE_PLACES',
  ManualImport = 'MANUAL_IMPORT',
  SelfSignup = 'SELF_SIGNUP'
}

export type SupplierStats = {
  __typename?: 'SupplierStats';
  contactsByChannel: Array<ContactChannelCount>;
  contactsLast30Days: Scalars['Int']['output'];
  contactsTotal: Scalars['Int']['output'];
  rating?: Maybe<Scalars['String']['output']>;
  reviewCount: Scalars['Int']['output'];
};

export type SupplierUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  businessEmail?: InputMaybe<Scalars['String']['input']>;
  businessEmailAlt?: InputMaybe<Scalars['String']['input']>;
  businessPhone?: InputMaybe<Scalars['String']['input']>;
  businessPhoneAlt?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  serviceProvinces?: InputMaybe<Array<Scalars['String']['input']>>;
  tagline?: InputMaybe<Scalars['String']['input']>;
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
  whatsappNumber?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  country: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  customer?: Maybe<Customer>;
  email: Scalars['String']['output'];
  isAdmin?: Maybe<Scalars['Boolean']['output']>;
  isCustomer?: Maybe<Scalars['Boolean']['output']>;
  isSupplier?: Maybe<Scalars['Boolean']['output']>;
  language: Language;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
  userId: Scalars['Int']['output'];
};

export type UserUpdateInput = {
  language?: InputMaybe<Language>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
};

export type AdminOverviewQueryVariables = Exact<{
  days?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AdminOverviewQuery = { __typename?: 'Query', adminOverview: { __typename?: 'AdminOverview', days: number, totals: { __typename?: 'AdminTotals', suppliers: number, verifiedSuppliers: number, pendingVerification: number, preferredSuppliers: number, customers: number, newSuppliers: number, newCustomers: number, contacts: number, uniqueContacters: number, chats: number }, daily: Array<{ __typename?: 'AdminDailyRow', day: string, newSuppliers: number, newCustomers: number, contacts: number }>, contactsByChannel: Array<{ __typename?: 'AdminCount', key: string, label: string, count: number }>, suppliersByProvince: Array<{ __typename?: 'AdminCount', key: string, label: string, count: number }>, topSuppliers: Array<{ __typename?: 'AdminTopSupplier', supplierId: number, companyName: string, provinceName?: string | null, contacts: number, rating?: string | null }> } };

export type AdminSuppliersQueryVariables = Exact<{
  filter?: InputMaybe<AdminSupplierFilter>;
}>;


export type AdminSuppliersQuery = { __typename?: 'Query', adminSuppliers: { __typename?: 'AdminSupplierPage', total: number, rows: Array<{ __typename?: 'AdminSupplierRow', supplierId: number, companyName: string, tagline?: string | null, description?: string | null, city?: string | null, province?: string | null, provinceName?: string | null, categories: Array<string>, businessPhone?: string | null, whatsappNumber?: string | null, businessEmail?: string | null, websiteUrl?: string | null, ownerName: string, ownerEmail: string, source: string, verifiedAt?: any | null, preferredAt?: any | null, preferredUntil?: any | null, preferred: boolean, rating?: string | null, reviewCount: number, contactsLast30Days: number, createdAt: any }> } };

export type AdminSetSupplierVerifiedMutationVariables = Exact<{
  supplierId: Scalars['Int']['input'];
  verified: Scalars['Boolean']['input'];
}>;


export type AdminSetSupplierVerifiedMutation = { __typename?: 'Mutation', adminSetSupplierVerified: boolean };

export type AdminSetSupplierPreferredMutationVariables = Exact<{
  data: AdminPreferredInput;
}>;


export type AdminSetSupplierPreferredMutation = { __typename?: 'Mutation', adminSetSupplierPreferred: boolean };

export type SessionUserFragment = { __typename?: 'User', userId: number, email: string, name: string, phone?: string | null, language: Language, country: string, profilePicture?: string | null, isCustomer?: boolean | null, isSupplier?: boolean | null, isAdmin?: boolean | null, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string } | null, customer?: { __typename?: 'Customer', customerId: number } | null };

export type LoginQueryVariables = Exact<{
  data: LoginUserInput;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, email: string, name: string, phone?: string | null, language: Language, country: string, profilePicture?: string | null, isCustomer?: boolean | null, isSupplier?: boolean | null, isAdmin?: boolean | null, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string } | null, customer?: { __typename?: 'Customer', customerId: number } | null } } };

export type RefreshUserQueryVariables = Exact<{
  data: Scalars['String']['input'];
}>;


export type RefreshUserQuery = { __typename?: 'Query', refreshUser: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, email: string, name: string, phone?: string | null, language: Language, country: string, profilePicture?: string | null, isCustomer?: boolean | null, isSupplier?: boolean | null, isAdmin?: boolean | null, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string } | null, customer?: { __typename?: 'Customer', customerId: number } | null } } };

export type SignupMutationVariables = Exact<{
  data: SignUpInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'User', userId: number, isCustomer?: boolean | null, isSupplier?: boolean | null } };

export type SocialLoginMutationVariables = Exact<{
  data: SocialLoginInput;
}>;


export type SocialLoginMutation = { __typename?: 'Mutation', socialLogin: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, email: string, name: string, phone?: string | null, language: Language, country: string, profilePicture?: string | null, isCustomer?: boolean | null, isSupplier?: boolean | null, isAdmin?: boolean | null, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string } | null, customer?: { __typename?: 'Customer', customerId: number } | null } } };

export type CompleteOnboardingMutationVariables = Exact<{
  data: CompleteOnboardingInput;
}>;


export type CompleteOnboardingMutation = { __typename?: 'Mutation', completeOnboarding: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, email: string, name: string, phone?: string | null, language: Language, country: string, profilePicture?: string | null, isCustomer?: boolean | null, isSupplier?: boolean | null, isAdmin?: boolean | null, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string } | null, customer?: { __typename?: 'Customer', customerId: number } | null } } };

export type RequestPasswordResetMutationVariables = Exact<{
  data: RequestPasswordResetInput;
}>;


export type RequestPasswordResetMutation = { __typename?: 'Mutation', requestPasswordReset: { __typename?: 'PasswordResetResult', ok: boolean, resetUrl?: string | null } };

export type ResetPasswordMutationVariables = Exact<{
  data: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'PasswordResetResult', ok: boolean } };

export type UpdateMeMutationVariables = Exact<{
  data: UserUpdateInput;
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe: { __typename?: 'User', userId: number, email: string, name: string, phone?: string | null, language: Language, country: string, profilePicture?: string | null, isCustomer?: boolean | null, isSupplier?: boolean | null, isAdmin?: boolean | null, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string } | null, customer?: { __typename?: 'Customer', customerId: number } | null } };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', categoryId: number, slug: string, nameEs: string, nameEn: string, icon?: string | null }> };

export type ProvincesQueryVariables = Exact<{
  country?: InputMaybe<Scalars['String']['input']>;
}>;


export type ProvincesQuery = { __typename?: 'Query', provinces: Array<{ __typename?: 'Province', code: string, name: string, country: string }> };

export type ResolveProvinceQueryVariables = Exact<{
  location?: InputMaybe<Scalars['String']['input']>;
  lat?: InputMaybe<Scalars['Float']['input']>;
  lng?: InputMaybe<Scalars['Float']['input']>;
}>;


export type ResolveProvinceQuery = { __typename?: 'Query', resolveProvince?: { __typename?: 'ResolvedProvince', code: string, name: string, source: string } | null };

export type LogSupplierContactMutationVariables = Exact<{
  data: ContactLogInput;
}>;


export type LogSupplierContactMutation = { __typename?: 'Mutation', logSupplierContact: boolean };

export type MergeGuestContactsMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type MergeGuestContactsMutation = { __typename?: 'Mutation', mergeGuestContacts: number };

export type MySavedContactsQueryVariables = Exact<{ [key: string]: never; }>;


export type MySavedContactsQuery = { __typename?: 'Query', mySavedContacts: Array<{ __typename?: 'SavedContact', supplierId: number, companyName: string, city?: string | null, province?: string | null, businessPhone?: string | null, whatsappNumber?: string | null, businessEmail?: string | null, websiteUrl?: string | null, lastContactedAt: any, lastChannel: string, contactCount: number, myRating?: number | null }>, reviewPrompts: Array<{ __typename?: 'ReviewPrompt', supplierId: number, companyName: string, city?: string | null, contactedAt: any }> };

export type DismissReviewPromptMutationVariables = Exact<{
  supplierId: Scalars['Int']['input'];
}>;


export type DismissReviewPromptMutation = { __typename?: 'Mutation', dismissReviewPrompt: boolean };

export type SupplierReviewsQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
}>;


export type SupplierReviewsQuery = { __typename?: 'Query', supplierReviews: Array<{ __typename?: 'ReviewView', reviewId: number, supplierId: number, rating: number, text?: string | null, reviewerName: string, createdAt: any, isMine: boolean }> };

export type SaveReviewMutationVariables = Exact<{
  data: ReviewInput;
}>;


export type SaveReviewMutation = { __typename?: 'Mutation', saveReview: { __typename?: 'ReviewView', reviewId: number, rating: number, text?: string | null, reviewerName: string, createdAt: any, isMine: boolean } };

export type DeleteReviewMutationVariables = Exact<{
  reviewId: Scalars['Int']['input'];
}>;


export type DeleteReviewMutation = { __typename?: 'Mutation', deleteReview: boolean };

export type SupplierCardFragment = { __typename?: 'Supplier', supplierId: number, companyName: string, tagline?: string | null, description?: string | null, skills?: Array<string> | null, city?: string | null, province?: string | null, provinceName?: string | null, serviceProvinces?: Array<string> | null, serviceProvinceNames: Array<string>, rating?: string | null, reviewCount?: number | null, verified: boolean, preferred: boolean, businessPhone?: string | null, businessPhoneAlt?: string | null, whatsappNumber?: string | null, businessEmail?: string | null, businessEmailAlt?: string | null, websiteUrl?: string | null, categories?: Array<{ __typename?: 'SupplierCategory', isPrimary: boolean, category?: { __typename?: 'Category', categoryId: number, slug: string, nameEs: string, nameEn: string, icon?: string | null } | null }> | null, services?: Array<{ __typename?: 'Service', serviceId: number, name: string, priceFrom?: string | null, priceUnit?: string | null, currency: string }> | null };

export type SupplierFullFragment = { __typename?: 'Supplier', address?: string | null, verifiedAt?: any | null, createdAt?: any | null, supplierId: number, companyName: string, tagline?: string | null, description?: string | null, skills?: Array<string> | null, city?: string | null, province?: string | null, provinceName?: string | null, serviceProvinces?: Array<string> | null, serviceProvinceNames: Array<string>, rating?: string | null, reviewCount?: number | null, verified: boolean, preferred: boolean, businessPhone?: string | null, businessPhoneAlt?: string | null, whatsappNumber?: string | null, businessEmail?: string | null, businessEmailAlt?: string | null, websiteUrl?: string | null, services?: Array<{ __typename?: 'Service', serviceId: number, name: string, description?: string | null, priceFrom?: string | null, priceUnit?: string | null, currency: string }> | null, media?: Array<{ __typename?: 'MediaAsset', mediaAssetId: number, url: string, altText?: string | null, displayOrder: number }> | null, categories?: Array<{ __typename?: 'SupplierCategory', isPrimary: boolean, category?: { __typename?: 'Category', categoryId: number, slug: string, nameEs: string, nameEn: string, icon?: string | null } | null }> | null };

export type SearchSuppliersQueryVariables = Exact<{
  data: SupplierSearchInput;
}>;


export type SearchSuppliersQuery = { __typename?: 'Query', searchSuppliers: { __typename?: 'SupplierSearchResult', province?: { __typename?: 'ResolvedProvince', code: string, name: string, source: string } | null, suppliers: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string, tagline?: string | null, description?: string | null, skills?: Array<string> | null, city?: string | null, province?: string | null, provinceName?: string | null, serviceProvinces?: Array<string> | null, serviceProvinceNames: Array<string>, rating?: string | null, reviewCount?: number | null, verified: boolean, preferred: boolean, businessPhone?: string | null, businessPhoneAlt?: string | null, whatsappNumber?: string | null, businessEmail?: string | null, businessEmailAlt?: string | null, websiteUrl?: string | null, categories?: Array<{ __typename?: 'SupplierCategory', isPrimary: boolean, category?: { __typename?: 'Category', categoryId: number, slug: string, nameEs: string, nameEn: string, icon?: string | null } | null }> | null, services?: Array<{ __typename?: 'Service', serviceId: number, name: string, priceFrom?: string | null, priceUnit?: string | null, currency: string }> | null }> } };

export type SuppliersQueryVariables = Exact<{
  province?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SuppliersQuery = { __typename?: 'Query', suppliers: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string, tagline?: string | null, description?: string | null, skills?: Array<string> | null, city?: string | null, province?: string | null, provinceName?: string | null, serviceProvinces?: Array<string> | null, serviceProvinceNames: Array<string>, rating?: string | null, reviewCount?: number | null, verified: boolean, preferred: boolean, businessPhone?: string | null, businessPhoneAlt?: string | null, whatsappNumber?: string | null, businessEmail?: string | null, businessEmailAlt?: string | null, websiteUrl?: string | null, categories?: Array<{ __typename?: 'SupplierCategory', isPrimary: boolean, category?: { __typename?: 'Category', categoryId: number, slug: string, nameEs: string, nameEn: string, icon?: string | null } | null }> | null, services?: Array<{ __typename?: 'Service', serviceId: number, name: string, priceFrom?: string | null, priceUnit?: string | null, currency: string }> | null }> };

export type SupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
}>;


export type SupplierQuery = { __typename?: 'Query', supplier: { __typename?: 'Supplier', address?: string | null, verifiedAt?: any | null, createdAt?: any | null, supplierId: number, companyName: string, tagline?: string | null, description?: string | null, skills?: Array<string> | null, city?: string | null, province?: string | null, provinceName?: string | null, serviceProvinces?: Array<string> | null, serviceProvinceNames: Array<string>, rating?: string | null, reviewCount?: number | null, verified: boolean, preferred: boolean, businessPhone?: string | null, businessPhoneAlt?: string | null, whatsappNumber?: string | null, businessEmail?: string | null, businessEmailAlt?: string | null, websiteUrl?: string | null, services?: Array<{ __typename?: 'Service', serviceId: number, name: string, description?: string | null, priceFrom?: string | null, priceUnit?: string | null, currency: string }> | null, media?: Array<{ __typename?: 'MediaAsset', mediaAssetId: number, url: string, altText?: string | null, displayOrder: number }> | null, categories?: Array<{ __typename?: 'SupplierCategory', isPrimary: boolean, category?: { __typename?: 'Category', categoryId: number, slug: string, nameEs: string, nameEn: string, icon?: string | null } | null }> | null } };

export type MySupplierQueryVariables = Exact<{ [key: string]: never; }>;


export type MySupplierQuery = { __typename?: 'Query', mySupplier: { __typename?: 'Supplier', address?: string | null, verifiedAt?: any | null, createdAt?: any | null, supplierId: number, companyName: string, tagline?: string | null, description?: string | null, skills?: Array<string> | null, city?: string | null, province?: string | null, provinceName?: string | null, serviceProvinces?: Array<string> | null, serviceProvinceNames: Array<string>, rating?: string | null, reviewCount?: number | null, verified: boolean, preferred: boolean, businessPhone?: string | null, businessPhoneAlt?: string | null, whatsappNumber?: string | null, businessEmail?: string | null, businessEmailAlt?: string | null, websiteUrl?: string | null, services?: Array<{ __typename?: 'Service', serviceId: number, name: string, description?: string | null, priceFrom?: string | null, priceUnit?: string | null, currency: string }> | null, media?: Array<{ __typename?: 'MediaAsset', mediaAssetId: number, url: string, altText?: string | null, displayOrder: number }> | null, categories?: Array<{ __typename?: 'SupplierCategory', isPrimary: boolean, category?: { __typename?: 'Category', categoryId: number, slug: string, nameEs: string, nameEn: string, icon?: string | null } | null }> | null }, mySupplierStats: { __typename?: 'SupplierStats', contactsLast30Days: number, contactsTotal: number, reviewCount: number, rating?: string | null, contactsByChannel: Array<{ __typename?: 'ContactChannelCount', channel: string, count: number }> } };

export type UpdateMySupplierMutationVariables = Exact<{
  data: SupplierUpdateInput;
}>;


export type UpdateMySupplierMutation = { __typename?: 'Mutation', updateMySupplier: { __typename?: 'Supplier', address?: string | null, verifiedAt?: any | null, createdAt?: any | null, supplierId: number, companyName: string, tagline?: string | null, description?: string | null, skills?: Array<string> | null, city?: string | null, province?: string | null, provinceName?: string | null, serviceProvinces?: Array<string> | null, serviceProvinceNames: Array<string>, rating?: string | null, reviewCount?: number | null, verified: boolean, preferred: boolean, businessPhone?: string | null, businessPhoneAlt?: string | null, whatsappNumber?: string | null, businessEmail?: string | null, businessEmailAlt?: string | null, websiteUrl?: string | null, services?: Array<{ __typename?: 'Service', serviceId: number, name: string, description?: string | null, priceFrom?: string | null, priceUnit?: string | null, currency: string }> | null, media?: Array<{ __typename?: 'MediaAsset', mediaAssetId: number, url: string, altText?: string | null, displayOrder: number }> | null, categories?: Array<{ __typename?: 'SupplierCategory', isPrimary: boolean, category?: { __typename?: 'Category', categoryId: number, slug: string, nameEs: string, nameEn: string, icon?: string | null } | null }> | null } };

export type SetMySupplierCategoriesMutationVariables = Exact<{
  data: SupplierCategoriesInput;
}>;


export type SetMySupplierCategoriesMutation = { __typename?: 'Mutation', setMySupplierCategories: boolean };

export type SetMySupplierSkillsMutationVariables = Exact<{
  skills: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type SetMySupplierSkillsMutation = { __typename?: 'Mutation', setMySupplierSkills: Array<string> };

export type SuggestMySupplierSkillsQueryVariables = Exact<{ [key: string]: never; }>;


export type SuggestMySupplierSkillsQuery = { __typename?: 'Query', suggestMySupplierSkills: Array<string> };

export type SaveMyServiceMutationVariables = Exact<{
  data: ServiceInput;
}>;


export type SaveMyServiceMutation = { __typename?: 'Mutation', saveMyService: { __typename?: 'Service', serviceId: number, name: string, description?: string | null, priceFrom?: string | null, priceUnit?: string | null, currency: string } };

export type DeleteMyServiceMutationVariables = Exact<{
  serviceId: Scalars['Int']['input'];
}>;


export type DeleteMyServiceMutation = { __typename?: 'Mutation', deleteMyService: boolean };

export type DeleteMySupplierMediaMutationVariables = Exact<{
  mediaAssetId: Scalars['Int']['input'];
}>;


export type DeleteMySupplierMediaMutation = { __typename?: 'Mutation', deleteMySupplierMedia: boolean };

export type ReorderMySupplierMediaMutationVariables = Exact<{
  mediaAssetIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type ReorderMySupplierMediaMutation = { __typename?: 'Mutation', reorderMySupplierMedia: boolean };

export const SessionUserFragmentDoc = gql`
    fragment SessionUser on User {
  userId
  email
  name
  phone
  language
  country
  profilePicture
  isCustomer
  isSupplier
  isAdmin
  supplier {
    supplierId
    companyName
  }
  customer {
    customerId
  }
}
    `;
export const SupplierCardFragmentDoc = gql`
    fragment SupplierCard on Supplier {
  supplierId
  companyName
  tagline
  description
  skills
  city
  province
  provinceName
  serviceProvinces
  serviceProvinceNames
  rating
  reviewCount
  verified
  preferred
  businessPhone
  businessPhoneAlt
  whatsappNumber
  businessEmail
  businessEmailAlt
  websiteUrl
  categories {
    isPrimary
    category {
      categoryId
      slug
      nameEs
      nameEn
      icon
    }
  }
  services {
    serviceId
    name
    priceFrom
    priceUnit
    currency
  }
}
    `;
export const SupplierFullFragmentDoc = gql`
    fragment SupplierFull on Supplier {
  ...SupplierCard
  address
  verifiedAt
  createdAt
  services {
    serviceId
    name
    description
    priceFrom
    priceUnit
    currency
  }
  media {
    mediaAssetId
    url
    altText
    displayOrder
  }
}
    ${SupplierCardFragmentDoc}`;
export const AdminOverviewDocument = gql`
    query adminOverview($days: Int) {
  adminOverview(days: $days) {
    days
    totals {
      suppliers
      verifiedSuppliers
      pendingVerification
      preferredSuppliers
      customers
      newSuppliers
      newCustomers
      contacts
      uniqueContacters
      chats
    }
    daily {
      day
      newSuppliers
      newCustomers
      contacts
    }
    contactsByChannel {
      key
      label
      count
    }
    suppliersByProvince {
      key
      label
      count
    }
    topSuppliers {
      supplierId
      companyName
      provinceName
      contacts
      rating
    }
  }
}
    `;

/**
 * __useAdminOverviewQuery__
 *
 * To run a query within a React component, call `useAdminOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOverviewQuery({
 *   variables: {
 *      days: // value for 'days'
 *   },
 * });
 */
export function useAdminOverviewQuery(baseOptions?: Apollo.QueryHookOptions<AdminOverviewQuery, AdminOverviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminOverviewQuery, AdminOverviewQueryVariables>(AdminOverviewDocument, options);
      }
export function useAdminOverviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminOverviewQuery, AdminOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminOverviewQuery, AdminOverviewQueryVariables>(AdminOverviewDocument, options);
        }
// @ts-ignore
export function useAdminOverviewSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminOverviewQuery, AdminOverviewQueryVariables>): Apollo.UseSuspenseQueryResult<AdminOverviewQuery, AdminOverviewQueryVariables>;
export function useAdminOverviewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminOverviewQuery, AdminOverviewQueryVariables>): Apollo.UseSuspenseQueryResult<AdminOverviewQuery | undefined, AdminOverviewQueryVariables>;
export function useAdminOverviewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminOverviewQuery, AdminOverviewQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminOverviewQuery, AdminOverviewQueryVariables>(AdminOverviewDocument, options);
        }
export type AdminOverviewQueryHookResult = ReturnType<typeof useAdminOverviewQuery>;
export type AdminOverviewLazyQueryHookResult = ReturnType<typeof useAdminOverviewLazyQuery>;
export type AdminOverviewSuspenseQueryHookResult = ReturnType<typeof useAdminOverviewSuspenseQuery>;
export type AdminOverviewQueryResult = Apollo.QueryResult<AdminOverviewQuery, AdminOverviewQueryVariables>;
export const AdminSuppliersDocument = gql`
    query adminSuppliers($filter: AdminSupplierFilter) {
  adminSuppliers(filter: $filter) {
    total
    rows {
      supplierId
      companyName
      tagline
      description
      city
      province
      provinceName
      categories
      businessPhone
      whatsappNumber
      businessEmail
      websiteUrl
      ownerName
      ownerEmail
      source
      verifiedAt
      preferredAt
      preferredUntil
      preferred
      rating
      reviewCount
      contactsLast30Days
      createdAt
    }
  }
}
    `;

/**
 * __useAdminSuppliersQuery__
 *
 * To run a query within a React component, call `useAdminSuppliersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminSuppliersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminSuppliersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useAdminSuppliersQuery(baseOptions?: Apollo.QueryHookOptions<AdminSuppliersQuery, AdminSuppliersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminSuppliersQuery, AdminSuppliersQueryVariables>(AdminSuppliersDocument, options);
      }
export function useAdminSuppliersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminSuppliersQuery, AdminSuppliersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminSuppliersQuery, AdminSuppliersQueryVariables>(AdminSuppliersDocument, options);
        }
// @ts-ignore
export function useAdminSuppliersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminSuppliersQuery, AdminSuppliersQueryVariables>): Apollo.UseSuspenseQueryResult<AdminSuppliersQuery, AdminSuppliersQueryVariables>;
export function useAdminSuppliersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminSuppliersQuery, AdminSuppliersQueryVariables>): Apollo.UseSuspenseQueryResult<AdminSuppliersQuery | undefined, AdminSuppliersQueryVariables>;
export function useAdminSuppliersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminSuppliersQuery, AdminSuppliersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminSuppliersQuery, AdminSuppliersQueryVariables>(AdminSuppliersDocument, options);
        }
export type AdminSuppliersQueryHookResult = ReturnType<typeof useAdminSuppliersQuery>;
export type AdminSuppliersLazyQueryHookResult = ReturnType<typeof useAdminSuppliersLazyQuery>;
export type AdminSuppliersSuspenseQueryHookResult = ReturnType<typeof useAdminSuppliersSuspenseQuery>;
export type AdminSuppliersQueryResult = Apollo.QueryResult<AdminSuppliersQuery, AdminSuppliersQueryVariables>;
export const AdminSetSupplierVerifiedDocument = gql`
    mutation adminSetSupplierVerified($supplierId: Int!, $verified: Boolean!) {
  adminSetSupplierVerified(supplierId: $supplierId, verified: $verified)
}
    `;
export type AdminSetSupplierVerifiedMutationFn = Apollo.MutationFunction<AdminSetSupplierVerifiedMutation, AdminSetSupplierVerifiedMutationVariables>;

/**
 * __useAdminSetSupplierVerifiedMutation__
 *
 * To run a mutation, you first call `useAdminSetSupplierVerifiedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminSetSupplierVerifiedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminSetSupplierVerifiedMutation, { data, loading, error }] = useAdminSetSupplierVerifiedMutation({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *      verified: // value for 'verified'
 *   },
 * });
 */
export function useAdminSetSupplierVerifiedMutation(baseOptions?: Apollo.MutationHookOptions<AdminSetSupplierVerifiedMutation, AdminSetSupplierVerifiedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdminSetSupplierVerifiedMutation, AdminSetSupplierVerifiedMutationVariables>(AdminSetSupplierVerifiedDocument, options);
      }
export type AdminSetSupplierVerifiedMutationHookResult = ReturnType<typeof useAdminSetSupplierVerifiedMutation>;
export type AdminSetSupplierVerifiedMutationResult = Apollo.MutationResult<AdminSetSupplierVerifiedMutation>;
export type AdminSetSupplierVerifiedMutationOptions = Apollo.BaseMutationOptions<AdminSetSupplierVerifiedMutation, AdminSetSupplierVerifiedMutationVariables>;
export const AdminSetSupplierPreferredDocument = gql`
    mutation adminSetSupplierPreferred($data: AdminPreferredInput!) {
  adminSetSupplierPreferred(data: $data)
}
    `;
export type AdminSetSupplierPreferredMutationFn = Apollo.MutationFunction<AdminSetSupplierPreferredMutation, AdminSetSupplierPreferredMutationVariables>;

/**
 * __useAdminSetSupplierPreferredMutation__
 *
 * To run a mutation, you first call `useAdminSetSupplierPreferredMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminSetSupplierPreferredMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminSetSupplierPreferredMutation, { data, loading, error }] = useAdminSetSupplierPreferredMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAdminSetSupplierPreferredMutation(baseOptions?: Apollo.MutationHookOptions<AdminSetSupplierPreferredMutation, AdminSetSupplierPreferredMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdminSetSupplierPreferredMutation, AdminSetSupplierPreferredMutationVariables>(AdminSetSupplierPreferredDocument, options);
      }
export type AdminSetSupplierPreferredMutationHookResult = ReturnType<typeof useAdminSetSupplierPreferredMutation>;
export type AdminSetSupplierPreferredMutationResult = Apollo.MutationResult<AdminSetSupplierPreferredMutation>;
export type AdminSetSupplierPreferredMutationOptions = Apollo.BaseMutationOptions<AdminSetSupplierPreferredMutation, AdminSetSupplierPreferredMutationVariables>;
export const LoginDocument = gql`
    query login($data: LoginUserInput!) {
  login(data: $data) {
    access_token
    expiresAt
    user {
      ...SessionUser
    }
  }
}
    ${SessionUserFragmentDoc}`;

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
      ...SessionUser
    }
  }
}
    ${SessionUserFragmentDoc}`;

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
    isCustomer
    isSupplier
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
export const SocialLoginDocument = gql`
    mutation socialLogin($data: SocialLoginInput!) {
  socialLogin(data: $data) {
    access_token
    expiresAt
    user {
      ...SessionUser
    }
  }
}
    ${SessionUserFragmentDoc}`;
export type SocialLoginMutationFn = Apollo.MutationFunction<SocialLoginMutation, SocialLoginMutationVariables>;

/**
 * __useSocialLoginMutation__
 *
 * To run a mutation, you first call `useSocialLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSocialLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [socialLoginMutation, { data, loading, error }] = useSocialLoginMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSocialLoginMutation(baseOptions?: Apollo.MutationHookOptions<SocialLoginMutation, SocialLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SocialLoginMutation, SocialLoginMutationVariables>(SocialLoginDocument, options);
      }
export type SocialLoginMutationHookResult = ReturnType<typeof useSocialLoginMutation>;
export type SocialLoginMutationResult = Apollo.MutationResult<SocialLoginMutation>;
export type SocialLoginMutationOptions = Apollo.BaseMutationOptions<SocialLoginMutation, SocialLoginMutationVariables>;
export const CompleteOnboardingDocument = gql`
    mutation completeOnboarding($data: CompleteOnboardingInput!) {
  completeOnboarding(data: $data) {
    access_token
    expiresAt
    user {
      ...SessionUser
    }
  }
}
    ${SessionUserFragmentDoc}`;
export type CompleteOnboardingMutationFn = Apollo.MutationFunction<CompleteOnboardingMutation, CompleteOnboardingMutationVariables>;

/**
 * __useCompleteOnboardingMutation__
 *
 * To run a mutation, you first call `useCompleteOnboardingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteOnboardingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeOnboardingMutation, { data, loading, error }] = useCompleteOnboardingMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCompleteOnboardingMutation(baseOptions?: Apollo.MutationHookOptions<CompleteOnboardingMutation, CompleteOnboardingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteOnboardingMutation, CompleteOnboardingMutationVariables>(CompleteOnboardingDocument, options);
      }
export type CompleteOnboardingMutationHookResult = ReturnType<typeof useCompleteOnboardingMutation>;
export type CompleteOnboardingMutationResult = Apollo.MutationResult<CompleteOnboardingMutation>;
export type CompleteOnboardingMutationOptions = Apollo.BaseMutationOptions<CompleteOnboardingMutation, CompleteOnboardingMutationVariables>;
export const RequestPasswordResetDocument = gql`
    mutation requestPasswordReset($data: RequestPasswordResetInput!) {
  requestPasswordReset(data: $data) {
    ok
    resetUrl
  }
}
    `;
export type RequestPasswordResetMutationFn = Apollo.MutationFunction<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;

/**
 * __useRequestPasswordResetMutation__
 *
 * To run a mutation, you first call `useRequestPasswordResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestPasswordResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestPasswordResetMutation, { data, loading, error }] = useRequestPasswordResetMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRequestPasswordResetMutation(baseOptions?: Apollo.MutationHookOptions<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>(RequestPasswordResetDocument, options);
      }
export type RequestPasswordResetMutationHookResult = ReturnType<typeof useRequestPasswordResetMutation>;
export type RequestPasswordResetMutationResult = Apollo.MutationResult<RequestPasswordResetMutation>;
export type RequestPasswordResetMutationOptions = Apollo.BaseMutationOptions<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation resetPassword($data: ResetPasswordInput!) {
  resetPassword(data: $data) {
    ok
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdateMeDocument = gql`
    mutation updateMe($data: UserUpdateInput!) {
  updateMe(data: $data) {
    ...SessionUser
  }
}
    ${SessionUserFragmentDoc}`;
export type UpdateMeMutationFn = Apollo.MutationFunction<UpdateMeMutation, UpdateMeMutationVariables>;

/**
 * __useUpdateMeMutation__
 *
 * To run a mutation, you first call `useUpdateMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeMutation, { data, loading, error }] = useUpdateMeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateMeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMeMutation, UpdateMeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMeMutation, UpdateMeMutationVariables>(UpdateMeDocument, options);
      }
export type UpdateMeMutationHookResult = ReturnType<typeof useUpdateMeMutation>;
export type UpdateMeMutationResult = Apollo.MutationResult<UpdateMeMutation>;
export type UpdateMeMutationOptions = Apollo.BaseMutationOptions<UpdateMeMutation, UpdateMeMutationVariables>;
export const CategoriesDocument = gql`
    query categories {
  categories {
    categoryId
    slug
    nameEs
    nameEn
    icon
  }
}
    `;

/**
 * __useCategoriesQuery__
 *
 * To run a query within a React component, call `useCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
      }
export function useCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
// @ts-ignore
export function useCategoriesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>): Apollo.UseSuspenseQueryResult<CategoriesQuery, CategoriesQueryVariables>;
export function useCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>): Apollo.UseSuspenseQueryResult<CategoriesQuery | undefined, CategoriesQueryVariables>;
export function useCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<typeof useCategoriesLazyQuery>;
export type CategoriesSuspenseQueryHookResult = ReturnType<typeof useCategoriesSuspenseQuery>;
export type CategoriesQueryResult = Apollo.QueryResult<CategoriesQuery, CategoriesQueryVariables>;
export const ProvincesDocument = gql`
    query provinces($country: String) {
  provinces(country: $country) {
    code
    name
    country
  }
}
    `;

/**
 * __useProvincesQuery__
 *
 * To run a query within a React component, call `useProvincesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProvincesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProvincesQuery({
 *   variables: {
 *      country: // value for 'country'
 *   },
 * });
 */
export function useProvincesQuery(baseOptions?: Apollo.QueryHookOptions<ProvincesQuery, ProvincesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProvincesQuery, ProvincesQueryVariables>(ProvincesDocument, options);
      }
export function useProvincesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProvincesQuery, ProvincesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProvincesQuery, ProvincesQueryVariables>(ProvincesDocument, options);
        }
// @ts-ignore
export function useProvincesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ProvincesQuery, ProvincesQueryVariables>): Apollo.UseSuspenseQueryResult<ProvincesQuery, ProvincesQueryVariables>;
export function useProvincesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProvincesQuery, ProvincesQueryVariables>): Apollo.UseSuspenseQueryResult<ProvincesQuery | undefined, ProvincesQueryVariables>;
export function useProvincesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProvincesQuery, ProvincesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProvincesQuery, ProvincesQueryVariables>(ProvincesDocument, options);
        }
export type ProvincesQueryHookResult = ReturnType<typeof useProvincesQuery>;
export type ProvincesLazyQueryHookResult = ReturnType<typeof useProvincesLazyQuery>;
export type ProvincesSuspenseQueryHookResult = ReturnType<typeof useProvincesSuspenseQuery>;
export type ProvincesQueryResult = Apollo.QueryResult<ProvincesQuery, ProvincesQueryVariables>;
export const ResolveProvinceDocument = gql`
    query resolveProvince($location: String, $lat: Float, $lng: Float) {
  resolveProvince(location: $location, lat: $lat, lng: $lng) {
    code
    name
    source
  }
}
    `;

/**
 * __useResolveProvinceQuery__
 *
 * To run a query within a React component, call `useResolveProvinceQuery` and pass it any options that fit your needs.
 * When your component renders, `useResolveProvinceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResolveProvinceQuery({
 *   variables: {
 *      location: // value for 'location'
 *      lat: // value for 'lat'
 *      lng: // value for 'lng'
 *   },
 * });
 */
export function useResolveProvinceQuery(baseOptions?: Apollo.QueryHookOptions<ResolveProvinceQuery, ResolveProvinceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResolveProvinceQuery, ResolveProvinceQueryVariables>(ResolveProvinceDocument, options);
      }
export function useResolveProvinceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResolveProvinceQuery, ResolveProvinceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResolveProvinceQuery, ResolveProvinceQueryVariables>(ResolveProvinceDocument, options);
        }
// @ts-ignore
export function useResolveProvinceSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ResolveProvinceQuery, ResolveProvinceQueryVariables>): Apollo.UseSuspenseQueryResult<ResolveProvinceQuery, ResolveProvinceQueryVariables>;
export function useResolveProvinceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ResolveProvinceQuery, ResolveProvinceQueryVariables>): Apollo.UseSuspenseQueryResult<ResolveProvinceQuery | undefined, ResolveProvinceQueryVariables>;
export function useResolveProvinceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ResolveProvinceQuery, ResolveProvinceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ResolveProvinceQuery, ResolveProvinceQueryVariables>(ResolveProvinceDocument, options);
        }
export type ResolveProvinceQueryHookResult = ReturnType<typeof useResolveProvinceQuery>;
export type ResolveProvinceLazyQueryHookResult = ReturnType<typeof useResolveProvinceLazyQuery>;
export type ResolveProvinceSuspenseQueryHookResult = ReturnType<typeof useResolveProvinceSuspenseQuery>;
export type ResolveProvinceQueryResult = Apollo.QueryResult<ResolveProvinceQuery, ResolveProvinceQueryVariables>;
export const LogSupplierContactDocument = gql`
    mutation logSupplierContact($data: ContactLogInput!) {
  logSupplierContact(data: $data)
}
    `;
export type LogSupplierContactMutationFn = Apollo.MutationFunction<LogSupplierContactMutation, LogSupplierContactMutationVariables>;

/**
 * __useLogSupplierContactMutation__
 *
 * To run a mutation, you first call `useLogSupplierContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogSupplierContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logSupplierContactMutation, { data, loading, error }] = useLogSupplierContactMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLogSupplierContactMutation(baseOptions?: Apollo.MutationHookOptions<LogSupplierContactMutation, LogSupplierContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogSupplierContactMutation, LogSupplierContactMutationVariables>(LogSupplierContactDocument, options);
      }
export type LogSupplierContactMutationHookResult = ReturnType<typeof useLogSupplierContactMutation>;
export type LogSupplierContactMutationResult = Apollo.MutationResult<LogSupplierContactMutation>;
export type LogSupplierContactMutationOptions = Apollo.BaseMutationOptions<LogSupplierContactMutation, LogSupplierContactMutationVariables>;
export const MergeGuestContactsDocument = gql`
    mutation mergeGuestContacts($deviceId: String!) {
  mergeGuestContacts(deviceId: $deviceId)
}
    `;
export type MergeGuestContactsMutationFn = Apollo.MutationFunction<MergeGuestContactsMutation, MergeGuestContactsMutationVariables>;

/**
 * __useMergeGuestContactsMutation__
 *
 * To run a mutation, you first call `useMergeGuestContactsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMergeGuestContactsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mergeGuestContactsMutation, { data, loading, error }] = useMergeGuestContactsMutation({
 *   variables: {
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useMergeGuestContactsMutation(baseOptions?: Apollo.MutationHookOptions<MergeGuestContactsMutation, MergeGuestContactsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MergeGuestContactsMutation, MergeGuestContactsMutationVariables>(MergeGuestContactsDocument, options);
      }
export type MergeGuestContactsMutationHookResult = ReturnType<typeof useMergeGuestContactsMutation>;
export type MergeGuestContactsMutationResult = Apollo.MutationResult<MergeGuestContactsMutation>;
export type MergeGuestContactsMutationOptions = Apollo.BaseMutationOptions<MergeGuestContactsMutation, MergeGuestContactsMutationVariables>;
export const MySavedContactsDocument = gql`
    query mySavedContacts {
  mySavedContacts {
    supplierId
    companyName
    city
    province
    businessPhone
    whatsappNumber
    businessEmail
    websiteUrl
    lastContactedAt
    lastChannel
    contactCount
    myRating
  }
  reviewPrompts {
    supplierId
    companyName
    city
    contactedAt
  }
}
    `;

/**
 * __useMySavedContactsQuery__
 *
 * To run a query within a React component, call `useMySavedContactsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMySavedContactsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMySavedContactsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMySavedContactsQuery(baseOptions?: Apollo.QueryHookOptions<MySavedContactsQuery, MySavedContactsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MySavedContactsQuery, MySavedContactsQueryVariables>(MySavedContactsDocument, options);
      }
export function useMySavedContactsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MySavedContactsQuery, MySavedContactsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MySavedContactsQuery, MySavedContactsQueryVariables>(MySavedContactsDocument, options);
        }
// @ts-ignore
export function useMySavedContactsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MySavedContactsQuery, MySavedContactsQueryVariables>): Apollo.UseSuspenseQueryResult<MySavedContactsQuery, MySavedContactsQueryVariables>;
export function useMySavedContactsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MySavedContactsQuery, MySavedContactsQueryVariables>): Apollo.UseSuspenseQueryResult<MySavedContactsQuery | undefined, MySavedContactsQueryVariables>;
export function useMySavedContactsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MySavedContactsQuery, MySavedContactsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MySavedContactsQuery, MySavedContactsQueryVariables>(MySavedContactsDocument, options);
        }
export type MySavedContactsQueryHookResult = ReturnType<typeof useMySavedContactsQuery>;
export type MySavedContactsLazyQueryHookResult = ReturnType<typeof useMySavedContactsLazyQuery>;
export type MySavedContactsSuspenseQueryHookResult = ReturnType<typeof useMySavedContactsSuspenseQuery>;
export type MySavedContactsQueryResult = Apollo.QueryResult<MySavedContactsQuery, MySavedContactsQueryVariables>;
export const DismissReviewPromptDocument = gql`
    mutation dismissReviewPrompt($supplierId: Int!) {
  dismissReviewPrompt(supplierId: $supplierId)
}
    `;
export type DismissReviewPromptMutationFn = Apollo.MutationFunction<DismissReviewPromptMutation, DismissReviewPromptMutationVariables>;

/**
 * __useDismissReviewPromptMutation__
 *
 * To run a mutation, you first call `useDismissReviewPromptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissReviewPromptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissReviewPromptMutation, { data, loading, error }] = useDismissReviewPromptMutation({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *   },
 * });
 */
export function useDismissReviewPromptMutation(baseOptions?: Apollo.MutationHookOptions<DismissReviewPromptMutation, DismissReviewPromptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DismissReviewPromptMutation, DismissReviewPromptMutationVariables>(DismissReviewPromptDocument, options);
      }
export type DismissReviewPromptMutationHookResult = ReturnType<typeof useDismissReviewPromptMutation>;
export type DismissReviewPromptMutationResult = Apollo.MutationResult<DismissReviewPromptMutation>;
export type DismissReviewPromptMutationOptions = Apollo.BaseMutationOptions<DismissReviewPromptMutation, DismissReviewPromptMutationVariables>;
export const SupplierReviewsDocument = gql`
    query supplierReviews($supplierId: Int!) {
  supplierReviews(supplierId: $supplierId) {
    reviewId
    supplierId
    rating
    text
    reviewerName
    createdAt
    isMine
  }
}
    `;

/**
 * __useSupplierReviewsQuery__
 *
 * To run a query within a React component, call `useSupplierReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSupplierReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSupplierReviewsQuery({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *   },
 * });
 */
export function useSupplierReviewsQuery(baseOptions: Apollo.QueryHookOptions<SupplierReviewsQuery, SupplierReviewsQueryVariables> & ({ variables: SupplierReviewsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SupplierReviewsQuery, SupplierReviewsQueryVariables>(SupplierReviewsDocument, options);
      }
export function useSupplierReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SupplierReviewsQuery, SupplierReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SupplierReviewsQuery, SupplierReviewsQueryVariables>(SupplierReviewsDocument, options);
        }
// @ts-ignore
export function useSupplierReviewsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SupplierReviewsQuery, SupplierReviewsQueryVariables>): Apollo.UseSuspenseQueryResult<SupplierReviewsQuery, SupplierReviewsQueryVariables>;
export function useSupplierReviewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SupplierReviewsQuery, SupplierReviewsQueryVariables>): Apollo.UseSuspenseQueryResult<SupplierReviewsQuery | undefined, SupplierReviewsQueryVariables>;
export function useSupplierReviewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SupplierReviewsQuery, SupplierReviewsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SupplierReviewsQuery, SupplierReviewsQueryVariables>(SupplierReviewsDocument, options);
        }
export type SupplierReviewsQueryHookResult = ReturnType<typeof useSupplierReviewsQuery>;
export type SupplierReviewsLazyQueryHookResult = ReturnType<typeof useSupplierReviewsLazyQuery>;
export type SupplierReviewsSuspenseQueryHookResult = ReturnType<typeof useSupplierReviewsSuspenseQuery>;
export type SupplierReviewsQueryResult = Apollo.QueryResult<SupplierReviewsQuery, SupplierReviewsQueryVariables>;
export const SaveReviewDocument = gql`
    mutation saveReview($data: ReviewInput!) {
  saveReview(data: $data) {
    reviewId
    rating
    text
    reviewerName
    createdAt
    isMine
  }
}
    `;
export type SaveReviewMutationFn = Apollo.MutationFunction<SaveReviewMutation, SaveReviewMutationVariables>;

/**
 * __useSaveReviewMutation__
 *
 * To run a mutation, you first call `useSaveReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveReviewMutation, { data, loading, error }] = useSaveReviewMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSaveReviewMutation(baseOptions?: Apollo.MutationHookOptions<SaveReviewMutation, SaveReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveReviewMutation, SaveReviewMutationVariables>(SaveReviewDocument, options);
      }
export type SaveReviewMutationHookResult = ReturnType<typeof useSaveReviewMutation>;
export type SaveReviewMutationResult = Apollo.MutationResult<SaveReviewMutation>;
export type SaveReviewMutationOptions = Apollo.BaseMutationOptions<SaveReviewMutation, SaveReviewMutationVariables>;
export const DeleteReviewDocument = gql`
    mutation deleteReview($reviewId: Int!) {
  deleteReview(reviewId: $reviewId)
}
    `;
export type DeleteReviewMutationFn = Apollo.MutationFunction<DeleteReviewMutation, DeleteReviewMutationVariables>;

/**
 * __useDeleteReviewMutation__
 *
 * To run a mutation, you first call `useDeleteReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReviewMutation, { data, loading, error }] = useDeleteReviewMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *   },
 * });
 */
export function useDeleteReviewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReviewMutation, DeleteReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReviewMutation, DeleteReviewMutationVariables>(DeleteReviewDocument, options);
      }
export type DeleteReviewMutationHookResult = ReturnType<typeof useDeleteReviewMutation>;
export type DeleteReviewMutationResult = Apollo.MutationResult<DeleteReviewMutation>;
export type DeleteReviewMutationOptions = Apollo.BaseMutationOptions<DeleteReviewMutation, DeleteReviewMutationVariables>;
export const SearchSuppliersDocument = gql`
    query searchSuppliers($data: SupplierSearchInput!) {
  searchSuppliers(data: $data) {
    province {
      code
      name
      source
    }
    suppliers {
      ...SupplierCard
    }
  }
}
    ${SupplierCardFragmentDoc}`;

/**
 * __useSearchSuppliersQuery__
 *
 * To run a query within a React component, call `useSearchSuppliersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSuppliersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSuppliersQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSearchSuppliersQuery(baseOptions: Apollo.QueryHookOptions<SearchSuppliersQuery, SearchSuppliersQueryVariables> & ({ variables: SearchSuppliersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchSuppliersQuery, SearchSuppliersQueryVariables>(SearchSuppliersDocument, options);
      }
export function useSearchSuppliersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchSuppliersQuery, SearchSuppliersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchSuppliersQuery, SearchSuppliersQueryVariables>(SearchSuppliersDocument, options);
        }
// @ts-ignore
export function useSearchSuppliersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchSuppliersQuery, SearchSuppliersQueryVariables>): Apollo.UseSuspenseQueryResult<SearchSuppliersQuery, SearchSuppliersQueryVariables>;
export function useSearchSuppliersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchSuppliersQuery, SearchSuppliersQueryVariables>): Apollo.UseSuspenseQueryResult<SearchSuppliersQuery | undefined, SearchSuppliersQueryVariables>;
export function useSearchSuppliersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchSuppliersQuery, SearchSuppliersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchSuppliersQuery, SearchSuppliersQueryVariables>(SearchSuppliersDocument, options);
        }
export type SearchSuppliersQueryHookResult = ReturnType<typeof useSearchSuppliersQuery>;
export type SearchSuppliersLazyQueryHookResult = ReturnType<typeof useSearchSuppliersLazyQuery>;
export type SearchSuppliersSuspenseQueryHookResult = ReturnType<typeof useSearchSuppliersSuspenseQuery>;
export type SearchSuppliersQueryResult = Apollo.QueryResult<SearchSuppliersQuery, SearchSuppliersQueryVariables>;
export const SuppliersDocument = gql`
    query suppliers($province: String, $limit: Int) {
  suppliers(province: $province, limit: $limit) {
    ...SupplierCard
  }
}
    ${SupplierCardFragmentDoc}`;

/**
 * __useSuppliersQuery__
 *
 * To run a query within a React component, call `useSuppliersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSuppliersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSuppliersQuery({
 *   variables: {
 *      province: // value for 'province'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSuppliersQuery(baseOptions?: Apollo.QueryHookOptions<SuppliersQuery, SuppliersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SuppliersQuery, SuppliersQueryVariables>(SuppliersDocument, options);
      }
export function useSuppliersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SuppliersQuery, SuppliersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SuppliersQuery, SuppliersQueryVariables>(SuppliersDocument, options);
        }
// @ts-ignore
export function useSuppliersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SuppliersQuery, SuppliersQueryVariables>): Apollo.UseSuspenseQueryResult<SuppliersQuery, SuppliersQueryVariables>;
export function useSuppliersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SuppliersQuery, SuppliersQueryVariables>): Apollo.UseSuspenseQueryResult<SuppliersQuery | undefined, SuppliersQueryVariables>;
export function useSuppliersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SuppliersQuery, SuppliersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SuppliersQuery, SuppliersQueryVariables>(SuppliersDocument, options);
        }
export type SuppliersQueryHookResult = ReturnType<typeof useSuppliersQuery>;
export type SuppliersLazyQueryHookResult = ReturnType<typeof useSuppliersLazyQuery>;
export type SuppliersSuspenseQueryHookResult = ReturnType<typeof useSuppliersSuspenseQuery>;
export type SuppliersQueryResult = Apollo.QueryResult<SuppliersQuery, SuppliersQueryVariables>;
export const SupplierDocument = gql`
    query supplier($supplierId: Int!) {
  supplier(supplierId: $supplierId) {
    ...SupplierFull
  }
}
    ${SupplierFullFragmentDoc}`;

/**
 * __useSupplierQuery__
 *
 * To run a query within a React component, call `useSupplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useSupplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSupplierQuery({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *   },
 * });
 */
export function useSupplierQuery(baseOptions: Apollo.QueryHookOptions<SupplierQuery, SupplierQueryVariables> & ({ variables: SupplierQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SupplierQuery, SupplierQueryVariables>(SupplierDocument, options);
      }
export function useSupplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SupplierQuery, SupplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SupplierQuery, SupplierQueryVariables>(SupplierDocument, options);
        }
// @ts-ignore
export function useSupplierSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SupplierQuery, SupplierQueryVariables>): Apollo.UseSuspenseQueryResult<SupplierQuery, SupplierQueryVariables>;
export function useSupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SupplierQuery, SupplierQueryVariables>): Apollo.UseSuspenseQueryResult<SupplierQuery | undefined, SupplierQueryVariables>;
export function useSupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SupplierQuery, SupplierQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SupplierQuery, SupplierQueryVariables>(SupplierDocument, options);
        }
export type SupplierQueryHookResult = ReturnType<typeof useSupplierQuery>;
export type SupplierLazyQueryHookResult = ReturnType<typeof useSupplierLazyQuery>;
export type SupplierSuspenseQueryHookResult = ReturnType<typeof useSupplierSuspenseQuery>;
export type SupplierQueryResult = Apollo.QueryResult<SupplierQuery, SupplierQueryVariables>;
export const MySupplierDocument = gql`
    query mySupplier {
  mySupplier {
    ...SupplierFull
  }
  mySupplierStats {
    contactsLast30Days
    contactsTotal
    contactsByChannel {
      channel
      count
    }
    reviewCount
    rating
  }
}
    ${SupplierFullFragmentDoc}`;

/**
 * __useMySupplierQuery__
 *
 * To run a query within a React component, call `useMySupplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useMySupplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMySupplierQuery({
 *   variables: {
 *   },
 * });
 */
export function useMySupplierQuery(baseOptions?: Apollo.QueryHookOptions<MySupplierQuery, MySupplierQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MySupplierQuery, MySupplierQueryVariables>(MySupplierDocument, options);
      }
export function useMySupplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MySupplierQuery, MySupplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MySupplierQuery, MySupplierQueryVariables>(MySupplierDocument, options);
        }
// @ts-ignore
export function useMySupplierSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MySupplierQuery, MySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<MySupplierQuery, MySupplierQueryVariables>;
export function useMySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MySupplierQuery, MySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<MySupplierQuery | undefined, MySupplierQueryVariables>;
export function useMySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MySupplierQuery, MySupplierQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MySupplierQuery, MySupplierQueryVariables>(MySupplierDocument, options);
        }
export type MySupplierQueryHookResult = ReturnType<typeof useMySupplierQuery>;
export type MySupplierLazyQueryHookResult = ReturnType<typeof useMySupplierLazyQuery>;
export type MySupplierSuspenseQueryHookResult = ReturnType<typeof useMySupplierSuspenseQuery>;
export type MySupplierQueryResult = Apollo.QueryResult<MySupplierQuery, MySupplierQueryVariables>;
export const UpdateMySupplierDocument = gql`
    mutation updateMySupplier($data: SupplierUpdateInput!) {
  updateMySupplier(data: $data) {
    ...SupplierFull
  }
}
    ${SupplierFullFragmentDoc}`;
export type UpdateMySupplierMutationFn = Apollo.MutationFunction<UpdateMySupplierMutation, UpdateMySupplierMutationVariables>;

/**
 * __useUpdateMySupplierMutation__
 *
 * To run a mutation, you first call `useUpdateMySupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMySupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMySupplierMutation, { data, loading, error }] = useUpdateMySupplierMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateMySupplierMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMySupplierMutation, UpdateMySupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMySupplierMutation, UpdateMySupplierMutationVariables>(UpdateMySupplierDocument, options);
      }
export type UpdateMySupplierMutationHookResult = ReturnType<typeof useUpdateMySupplierMutation>;
export type UpdateMySupplierMutationResult = Apollo.MutationResult<UpdateMySupplierMutation>;
export type UpdateMySupplierMutationOptions = Apollo.BaseMutationOptions<UpdateMySupplierMutation, UpdateMySupplierMutationVariables>;
export const SetMySupplierCategoriesDocument = gql`
    mutation setMySupplierCategories($data: SupplierCategoriesInput!) {
  setMySupplierCategories(data: $data)
}
    `;
export type SetMySupplierCategoriesMutationFn = Apollo.MutationFunction<SetMySupplierCategoriesMutation, SetMySupplierCategoriesMutationVariables>;

/**
 * __useSetMySupplierCategoriesMutation__
 *
 * To run a mutation, you first call `useSetMySupplierCategoriesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetMySupplierCategoriesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setMySupplierCategoriesMutation, { data, loading, error }] = useSetMySupplierCategoriesMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSetMySupplierCategoriesMutation(baseOptions?: Apollo.MutationHookOptions<SetMySupplierCategoriesMutation, SetMySupplierCategoriesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetMySupplierCategoriesMutation, SetMySupplierCategoriesMutationVariables>(SetMySupplierCategoriesDocument, options);
      }
export type SetMySupplierCategoriesMutationHookResult = ReturnType<typeof useSetMySupplierCategoriesMutation>;
export type SetMySupplierCategoriesMutationResult = Apollo.MutationResult<SetMySupplierCategoriesMutation>;
export type SetMySupplierCategoriesMutationOptions = Apollo.BaseMutationOptions<SetMySupplierCategoriesMutation, SetMySupplierCategoriesMutationVariables>;
export const SetMySupplierSkillsDocument = gql`
    mutation setMySupplierSkills($skills: [String!]!) {
  setMySupplierSkills(skills: $skills)
}
    `;
export type SetMySupplierSkillsMutationFn = Apollo.MutationFunction<SetMySupplierSkillsMutation, SetMySupplierSkillsMutationVariables>;

/**
 * __useSetMySupplierSkillsMutation__
 *
 * To run a mutation, you first call `useSetMySupplierSkillsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetMySupplierSkillsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setMySupplierSkillsMutation, { data, loading, error }] = useSetMySupplierSkillsMutation({
 *   variables: {
 *      skills: // value for 'skills'
 *   },
 * });
 */
export function useSetMySupplierSkillsMutation(baseOptions?: Apollo.MutationHookOptions<SetMySupplierSkillsMutation, SetMySupplierSkillsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetMySupplierSkillsMutation, SetMySupplierSkillsMutationVariables>(SetMySupplierSkillsDocument, options);
      }
export type SetMySupplierSkillsMutationHookResult = ReturnType<typeof useSetMySupplierSkillsMutation>;
export type SetMySupplierSkillsMutationResult = Apollo.MutationResult<SetMySupplierSkillsMutation>;
export type SetMySupplierSkillsMutationOptions = Apollo.BaseMutationOptions<SetMySupplierSkillsMutation, SetMySupplierSkillsMutationVariables>;
export const SuggestMySupplierSkillsDocument = gql`
    query suggestMySupplierSkills {
  suggestMySupplierSkills
}
    `;

/**
 * __useSuggestMySupplierSkillsQuery__
 *
 * To run a query within a React component, call `useSuggestMySupplierSkillsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSuggestMySupplierSkillsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSuggestMySupplierSkillsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSuggestMySupplierSkillsQuery(baseOptions?: Apollo.QueryHookOptions<SuggestMySupplierSkillsQuery, SuggestMySupplierSkillsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SuggestMySupplierSkillsQuery, SuggestMySupplierSkillsQueryVariables>(SuggestMySupplierSkillsDocument, options);
      }
export function useSuggestMySupplierSkillsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SuggestMySupplierSkillsQuery, SuggestMySupplierSkillsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SuggestMySupplierSkillsQuery, SuggestMySupplierSkillsQueryVariables>(SuggestMySupplierSkillsDocument, options);
        }
// @ts-ignore
export function useSuggestMySupplierSkillsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SuggestMySupplierSkillsQuery, SuggestMySupplierSkillsQueryVariables>): Apollo.UseSuspenseQueryResult<SuggestMySupplierSkillsQuery, SuggestMySupplierSkillsQueryVariables>;
export function useSuggestMySupplierSkillsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SuggestMySupplierSkillsQuery, SuggestMySupplierSkillsQueryVariables>): Apollo.UseSuspenseQueryResult<SuggestMySupplierSkillsQuery | undefined, SuggestMySupplierSkillsQueryVariables>;
export function useSuggestMySupplierSkillsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SuggestMySupplierSkillsQuery, SuggestMySupplierSkillsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SuggestMySupplierSkillsQuery, SuggestMySupplierSkillsQueryVariables>(SuggestMySupplierSkillsDocument, options);
        }
export type SuggestMySupplierSkillsQueryHookResult = ReturnType<typeof useSuggestMySupplierSkillsQuery>;
export type SuggestMySupplierSkillsLazyQueryHookResult = ReturnType<typeof useSuggestMySupplierSkillsLazyQuery>;
export type SuggestMySupplierSkillsSuspenseQueryHookResult = ReturnType<typeof useSuggestMySupplierSkillsSuspenseQuery>;
export type SuggestMySupplierSkillsQueryResult = Apollo.QueryResult<SuggestMySupplierSkillsQuery, SuggestMySupplierSkillsQueryVariables>;
export const SaveMyServiceDocument = gql`
    mutation saveMyService($data: ServiceInput!) {
  saveMyService(data: $data) {
    serviceId
    name
    description
    priceFrom
    priceUnit
    currency
  }
}
    `;
export type SaveMyServiceMutationFn = Apollo.MutationFunction<SaveMyServiceMutation, SaveMyServiceMutationVariables>;

/**
 * __useSaveMyServiceMutation__
 *
 * To run a mutation, you first call `useSaveMyServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveMyServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveMyServiceMutation, { data, loading, error }] = useSaveMyServiceMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSaveMyServiceMutation(baseOptions?: Apollo.MutationHookOptions<SaveMyServiceMutation, SaveMyServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveMyServiceMutation, SaveMyServiceMutationVariables>(SaveMyServiceDocument, options);
      }
export type SaveMyServiceMutationHookResult = ReturnType<typeof useSaveMyServiceMutation>;
export type SaveMyServiceMutationResult = Apollo.MutationResult<SaveMyServiceMutation>;
export type SaveMyServiceMutationOptions = Apollo.BaseMutationOptions<SaveMyServiceMutation, SaveMyServiceMutationVariables>;
export const DeleteMyServiceDocument = gql`
    mutation deleteMyService($serviceId: Int!) {
  deleteMyService(serviceId: $serviceId)
}
    `;
export type DeleteMyServiceMutationFn = Apollo.MutationFunction<DeleteMyServiceMutation, DeleteMyServiceMutationVariables>;

/**
 * __useDeleteMyServiceMutation__
 *
 * To run a mutation, you first call `useDeleteMyServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMyServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMyServiceMutation, { data, loading, error }] = useDeleteMyServiceMutation({
 *   variables: {
 *      serviceId: // value for 'serviceId'
 *   },
 * });
 */
export function useDeleteMyServiceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMyServiceMutation, DeleteMyServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMyServiceMutation, DeleteMyServiceMutationVariables>(DeleteMyServiceDocument, options);
      }
export type DeleteMyServiceMutationHookResult = ReturnType<typeof useDeleteMyServiceMutation>;
export type DeleteMyServiceMutationResult = Apollo.MutationResult<DeleteMyServiceMutation>;
export type DeleteMyServiceMutationOptions = Apollo.BaseMutationOptions<DeleteMyServiceMutation, DeleteMyServiceMutationVariables>;
export const DeleteMySupplierMediaDocument = gql`
    mutation deleteMySupplierMedia($mediaAssetId: Int!) {
  deleteMySupplierMedia(mediaAssetId: $mediaAssetId)
}
    `;
export type DeleteMySupplierMediaMutationFn = Apollo.MutationFunction<DeleteMySupplierMediaMutation, DeleteMySupplierMediaMutationVariables>;

/**
 * __useDeleteMySupplierMediaMutation__
 *
 * To run a mutation, you first call `useDeleteMySupplierMediaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMySupplierMediaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMySupplierMediaMutation, { data, loading, error }] = useDeleteMySupplierMediaMutation({
 *   variables: {
 *      mediaAssetId: // value for 'mediaAssetId'
 *   },
 * });
 */
export function useDeleteMySupplierMediaMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMySupplierMediaMutation, DeleteMySupplierMediaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMySupplierMediaMutation, DeleteMySupplierMediaMutationVariables>(DeleteMySupplierMediaDocument, options);
      }
export type DeleteMySupplierMediaMutationHookResult = ReturnType<typeof useDeleteMySupplierMediaMutation>;
export type DeleteMySupplierMediaMutationResult = Apollo.MutationResult<DeleteMySupplierMediaMutation>;
export type DeleteMySupplierMediaMutationOptions = Apollo.BaseMutationOptions<DeleteMySupplierMediaMutation, DeleteMySupplierMediaMutationVariables>;
export const ReorderMySupplierMediaDocument = gql`
    mutation reorderMySupplierMedia($mediaAssetIds: [Int!]!) {
  reorderMySupplierMedia(mediaAssetIds: $mediaAssetIds)
}
    `;
export type ReorderMySupplierMediaMutationFn = Apollo.MutationFunction<ReorderMySupplierMediaMutation, ReorderMySupplierMediaMutationVariables>;

/**
 * __useReorderMySupplierMediaMutation__
 *
 * To run a mutation, you first call `useReorderMySupplierMediaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReorderMySupplierMediaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reorderMySupplierMediaMutation, { data, loading, error }] = useReorderMySupplierMediaMutation({
 *   variables: {
 *      mediaAssetIds: // value for 'mediaAssetIds'
 *   },
 * });
 */
export function useReorderMySupplierMediaMutation(baseOptions?: Apollo.MutationHookOptions<ReorderMySupplierMediaMutation, ReorderMySupplierMediaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReorderMySupplierMediaMutation, ReorderMySupplierMediaMutationVariables>(ReorderMySupplierMediaDocument, options);
      }
export type ReorderMySupplierMediaMutationHookResult = ReturnType<typeof useReorderMySupplierMediaMutation>;
export type ReorderMySupplierMediaMutationResult = Apollo.MutationResult<ReorderMySupplierMediaMutation>;
export type ReorderMySupplierMediaMutationOptions = Apollo.BaseMutationOptions<ReorderMySupplierMediaMutation, ReorderMySupplierMediaMutationVariables>;
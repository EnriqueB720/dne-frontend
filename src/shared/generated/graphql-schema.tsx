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

export type AiChatMessageInput = {
  content: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export type AiCompletionInput = {
  cachedSystem?: InputMaybe<Scalars['String']['input']>;
  messages: Array<AiChatMessageInput>;
  model: Scalars['String']['input'];
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
  model: Scalars['String']['output'];
  requestId?: Maybe<Scalars['Float']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId?: Maybe<Scalars['Float']['output']>;
};

export type AiConversationCreateInput = {
  deviceId?: InputMaybe<Scalars['String']['input']>;
  model: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type AiConversationLinkInput = {
  conversationId: Scalars['String']['input'];
  requestId: Scalars['Int']['input'];
};

export type AiConversationUpdateInput = {
  conversationId: Scalars['String']['input'];
  model?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type AiMessage = {
  __typename?: 'AiMessage';
  content: Scalars['String']['output'];
  conversationId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  inputTokens?: Maybe<Scalars['Float']['output']>;
  messageId: Scalars['String']['output'];
  model?: Maybe<Scalars['String']['output']>;
  outputTokens?: Maybe<Scalars['Float']['output']>;
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
  model?: InputMaybe<Scalars['String']['input']>;
  system?: InputMaybe<Scalars['String']['input']>;
};

export type AiMessageUsage = {
  __typename?: 'AiMessageUsage';
  inputTokens?: Maybe<Scalars['Float']['output']>;
  outputTokens?: Maybe<Scalars['Float']['output']>;
};

export type Booking = {
  __typename?: 'Booking';
  bookingId: Scalars['Float']['output'];
  cancellationReason?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  cancelledBy?: Maybe<Scalars['String']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  customerId: Scalars['Float']['output'];
  guestCount?: Maybe<Scalars['Float']['output']>;
  location: Scalars['String']['output'];
  paymentStatus: PaymentStatus;
  phoneRevealedAt?: Maybe<Scalars['DateTime']['output']>;
  platformFee: Scalars['String']['output'];
  quoteId: Scalars['Float']['output'];
  requestId: Scalars['Float']['output'];
  serviceDate: Scalars['DateTime']['output'];
  serviceEndDate?: Maybe<Scalars['DateTime']['output']>;
  status: BookingStatus;
  supplierId: Scalars['Float']['output'];
  supplierPayout: Scalars['String']['output'];
  totalPrice: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BookingCancelInput = {
  bookingId: Scalars['Int']['input'];
  cancelledBy?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type BookingCompleteInput = {
  bookingId: Scalars['Int']['input'];
};

/** Lifecycle status of a booking */
export enum BookingStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Disputed = 'DISPUTED',
  InProgress = 'IN_PROGRESS'
}

export type BookingWhereInput = {
  bookingId?: InputMaybe<Scalars['Int']['input']>;
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  allDay: Scalars['Boolean']['output'];
  bookingId?: Maybe<Scalars['Float']['output']>;
  calendarEventId: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  endsAt: Scalars['DateTime']['output'];
  eventType: EventType;
  location?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  quoteId?: Maybe<Scalars['Float']['output']>;
  recurrenceRule?: Maybe<Scalars['String']['output']>;
  startsAt: Scalars['DateTime']['output'];
  status: EventStatus;
  supplierId: Scalars['Float']['output'];
  timezone: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CalendarEventCancelInput = {
  calendarEventId: Scalars['Int']['input'];
};

export type CalendarEventCreateInput = {
  allDay?: InputMaybe<Scalars['Boolean']['input']>;
  endsAt: Scalars['DateTime']['input'];
  eventType?: InputMaybe<EventType>;
  location?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  recurrenceRule?: InputMaybe<Scalars['String']['input']>;
  startsAt: Scalars['DateTime']['input'];
  supplierId: Scalars['Int']['input'];
  timezone?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CalendarEventUpdateInput = {
  allDay?: InputMaybe<Scalars['Boolean']['input']>;
  calendarEventId: Scalars['Int']['input'];
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  startsAt?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<EventStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CalendarEventWhereInput = {
  calendarEventId?: InputMaybe<Scalars['Int']['input']>;
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

export type Customer = {
  __typename?: 'Customer';
  createdAt: Scalars['DateTime']['output'];
  customerId: Scalars['Float']['output'];
  defaultCity?: Maybe<Scalars['String']['output']>;
  marketingOptIn: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['Float']['output'];
};

/** Lifecycle status of a calendar event */
export enum EventStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED'
}

/** Type of supplier calendar event */
export enum EventType {
  Blocked = 'BLOCKED',
  Booking = 'BOOKING',
  External = 'EXTERNAL',
  Recurring = 'RECURRING',
  Tentative = 'TENTATIVE'
}

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
  acceptQuote: Booking;
  aiComplete: AiCompletionResult;
  cancelBooking: Booking;
  cancelCalendarEvent: CalendarEvent;
  closeRequest: Request;
  completeBooking: Booking;
  createAiConversation: AiConversation;
  createCalendarEvent: CalendarEvent;
  createCategory: Category;
  createPost: Post;
  createPricing: Pricing;
  createQuote: Quote;
  createRequest: Request;
  createSubscription: Subscription;
  createSupplier: Supplier;
  createUser: User;
  deleteAiConversation: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  linkAiConversationToRequest: AiConversation;
  markQuotesViewed: Scalars['Float']['output'];
  mergeGuestAiConversations: Scalars['Float']['output'];
  rollbackLastAiTurn: Scalars['Float']['output'];
  sendAiMessage: SendAiMessageResult;
  signup: User;
  updateAiConversation: AiConversation;
  updateAiMessageProviders: AiMessage;
  updateCalendarEvent: CalendarEvent;
  updatePost: Post;
  updateRequestStatus: Request;
  withdrawQuote: Quote;
};


export type MutationAcceptQuoteArgs = {
  data: QuoteAcceptInput;
};


export type MutationAiCompleteArgs = {
  data: AiCompletionInput;
};


export type MutationCancelBookingArgs = {
  data: BookingCancelInput;
};


export type MutationCancelCalendarEventArgs = {
  data: CalendarEventCancelInput;
};


export type MutationCloseRequestArgs = {
  data: RequestCloseInput;
};


export type MutationCompleteBookingArgs = {
  data: BookingCompleteInput;
};


export type MutationCreateAiConversationArgs = {
  data: AiConversationCreateInput;
};


export type MutationCreateCalendarEventArgs = {
  data: CalendarEventCreateInput;
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


export type MutationCreateQuoteArgs = {
  data: QuoteCreateInput;
};


export type MutationCreateRequestArgs = {
  data: RequestCreateInput;
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


export type MutationDeleteAiConversationArgs = {
  conversationId: Scalars['String']['input'];
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeletePostArgs = {
  whereUnique: PostWhereUniqueInput;
};


export type MutationLinkAiConversationToRequestArgs = {
  data: AiConversationLinkInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationMarkQuotesViewedArgs = {
  data: QuoteMarkViewedInput;
};


export type MutationMergeGuestAiConversationsArgs = {
  deviceId: Scalars['String']['input'];
};


export type MutationRollbackLastAiTurnArgs = {
  conversationId: Scalars['String']['input'];
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSendAiMessageArgs = {
  data: AiMessageSendInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSignupArgs = {
  data: SignUpInput;
};


export type MutationUpdateAiConversationArgs = {
  data: AiConversationUpdateInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateAiMessageProvidersArgs = {
  data: AiMessageProvidersUpdateInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCalendarEventArgs = {
  data: CalendarEventUpdateInput;
};


export type MutationUpdatePostArgs = {
  data: PostUpdateInput;
  where?: InputMaybe<PostWhereInput>;
  whereUnique?: InputMaybe<PostWhereUniqueInput>;
};


export type MutationUpdateRequestStatusArgs = {
  data: RequestUpdateStatusInput;
};


export type MutationWithdrawQuoteArgs = {
  data: QuoteWithdrawInput;
};

/** Payment lifecycle on a booking */
export enum PaymentStatus {
  DepositPaid = 'DEPOSIT_PAID',
  Failed = 'FAILED',
  FullyPaid = 'FULLY_PAID',
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

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

/** How a service is priced */
export enum PricingModel {
  Custom = 'CUSTOM',
  Flat = 'FLAT',
  PerDay = 'PER_DAY',
  PerHour = 'PER_HOUR',
  PerPerson = 'PER_PERSON'
}

export type PricingWhereInput = {
  planId?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  aiConversation: AiConversation;
  aiConversations: Array<AiConversation>;
  aiMessages: Array<AiMessage>;
  booking: Booking;
  bookingsByCustomer: Array<Booking>;
  bookingsBySupplier: Array<Booking>;
  calendarEvent: CalendarEvent;
  calendarEventsBySupplier: Array<CalendarEvent>;
  category: Category;
  login: LoginOutput;
  post: Post;
  postsBySupplier: Array<Post>;
  pricing: Pricing;
  quote: Quote;
  quotesByRequest: Array<Quote>;
  quotesBySupplier: Array<Quote>;
  refreshUser: LoginOutput;
  request: Request;
  requestsByCustomer: Array<Request>;
  search: Search;
  searchSuppliers: Array<Supplier>;
  subscription: Subscription;
  supplier: Supplier;
  suppliers: Array<Supplier>;
  user: User;
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


export type QueryBookingArgs = {
  where: BookingWhereInput;
};


export type QueryBookingsByCustomerArgs = {
  customerId: Scalars['Int']['input'];
  status?: InputMaybe<BookingStatus>;
};


export type QueryBookingsBySupplierArgs = {
  status?: InputMaybe<BookingStatus>;
  supplierId: Scalars['Int']['input'];
};


export type QueryCalendarEventArgs = {
  where: CalendarEventWhereInput;
};


export type QueryCalendarEventsBySupplierArgs = {
  from?: InputMaybe<Scalars['DateTime']['input']>;
  supplierId: Scalars['Int']['input'];
  to?: InputMaybe<Scalars['DateTime']['input']>;
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


export type QueryQuoteArgs = {
  where: QuoteWhereInput;
};


export type QueryQuotesByRequestArgs = {
  requestId: Scalars['Int']['input'];
  status?: InputMaybe<QuoteStatus>;
};


export type QueryQuotesBySupplierArgs = {
  status?: InputMaybe<QuoteStatus>;
  supplierId: Scalars['Int']['input'];
};


export type QueryRefreshUserArgs = {
  data: Scalars['String']['input'];
};


export type QueryRequestArgs = {
  where: RequestWhereInput;
};


export type QueryRequestsByCustomerArgs = {
  customerId: Scalars['Int']['input'];
  status?: InputMaybe<RequestStatus>;
};


export type QuerySearchArgs = {
  query?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
};


export type QuerySearchSuppliersArgs = {
  data: SupplierSearchInput;
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

export type Quote = {
  __typename?: 'Quote';
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  items?: Maybe<Array<QuoteItem>>;
  message?: Maybe<Scalars['String']['output']>;
  quoteId: Scalars['Float']['output'];
  requestId: Scalars['Float']['output'];
  respondedAt?: Maybe<Scalars['DateTime']['output']>;
  status: QuoteStatus;
  supplierId: Scalars['Float']['output'];
  totalPrice: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  validUntil: Scalars['DateTime']['output'];
  viewedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type QuoteAcceptInput = {
  quoteId: Scalars['Int']['input'];
};

export type QuoteCreateInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<QuoteItemInput>>;
  message?: InputMaybe<Scalars['String']['input']>;
  requestId: Scalars['Int']['input'];
  supplierId: Scalars['Int']['input'];
  totalPrice: Scalars['Float']['input'];
  validUntil: Scalars['DateTime']['input'];
};

export type QuoteItem = {
  __typename?: 'QuoteItem';
  description: Scalars['String']['output'];
  quantity: Scalars['String']['output'];
  quoteId: Scalars['Float']['output'];
  quoteItemId: Scalars['Float']['output'];
  serviceId?: Maybe<Scalars['Float']['output']>;
  total: Scalars['String']['output'];
  unitPrice: Scalars['String']['output'];
};

export type QuoteItemInput = {
  description: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  serviceId?: InputMaybe<Scalars['Int']['input']>;
  total: Scalars['Float']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type QuoteMarkViewedInput = {
  requestId: Scalars['Int']['input'];
};

/** Lifecycle status of a supplier quote */
export enum QuoteStatus {
  Accepted = 'ACCEPTED',
  Expired = 'EXPIRED',
  Rejected = 'REJECTED',
  Sent = 'SENT',
  Viewed = 'VIEWED',
  Withdrawn = 'WITHDRAWN'
}

export type QuoteWhereInput = {
  quoteId?: InputMaybe<Scalars['Int']['input']>;
};

export type QuoteWithdrawInput = {
  quoteId: Scalars['Int']['input'];
};

export type Request = {
  __typename?: 'Request';
  budgetMax?: Maybe<Scalars['String']['output']>;
  budgetMin?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['Float']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  closedAt?: Maybe<Scalars['DateTime']['output']>;
  closedReason?: Maybe<Scalars['String']['output']>;
  conversationTurns: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  customerId: Scalars['Float']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  guestCount?: Maybe<Scalars['Float']['output']>;
  isComplete: Scalars['Boolean']['output'];
  quotes?: Maybe<Array<Quote>>;
  rawQuery: Scalars['String']['output'];
  requestId: Scalars['Float']['output'];
  serviceDate?: Maybe<Scalars['DateTime']['output']>;
  status: RequestStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type RequestCloseInput = {
  reason?: InputMaybe<Scalars['String']['input']>;
  requestId: Scalars['Int']['input'];
};

export type RequestCreateInput = {
  budgetMax?: InputMaybe<Scalars['Float']['input']>;
  budgetMin?: InputMaybe<Scalars['Float']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  conversationTurns?: InputMaybe<Scalars['Int']['input']>;
  customerId: Scalars['Int']['input'];
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  guestCount?: InputMaybe<Scalars['Int']['input']>;
  rawQuery: Scalars['String']['input'];
  serviceDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Lifecycle status of a customer service request */
export enum RequestStatus {
  AwaitingQuotes = 'AWAITING_QUOTES',
  Booked = 'BOOKED',
  Closed = 'CLOSED',
  Gathering = 'GATHERING',
  Matching = 'MATCHING',
  QuotesReceived = 'QUOTES_RECEIVED'
}

export type RequestUpdateStatusInput = {
  requestId: Scalars['Int']['input'];
  status: RequestStatus;
};

export type RequestWhereInput = {
  requestId?: InputMaybe<Scalars['Int']['input']>;
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
  active: Scalars['Boolean']['output'];
  basePrice: Scalars['String']['output'];
  categoryId: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  maxTotalPrice?: Maybe<Scalars['String']['output']>;
  maxUnits?: Maybe<Scalars['Float']['output']>;
  minTotalPrice?: Maybe<Scalars['String']['output']>;
  minUnits?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  pricingModel: PricingModel;
  serviceId: Scalars['Float']['output'];
  supplierId: Scalars['Float']['output'];
  unitLabel?: Maybe<Scalars['String']['output']>;
};

export type SignUpInput = {
  companyName?: InputMaybe<Scalars['String']['input']>;
  country: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
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
  businessEmail?: Maybe<Scalars['String']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  companyName: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  maxCapacity?: Maybe<Scalars['Float']['output']>;
  minCapacity?: Maybe<Scalars['Float']['output']>;
  posts?: Maybe<Array<Post>>;
  premium?: Maybe<Scalars['Boolean']['output']>;
  rating?: Maybe<Scalars['String']['output']>;
  responseTimeMinutes?: Maybe<Scalars['Float']['output']>;
  reviewCount?: Maybe<Scalars['Float']['output']>;
  services?: Maybe<Array<Service>>;
  slug?: Maybe<Scalars['String']['output']>;
  supplierId: Scalars['Float']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  verified?: Maybe<Scalars['Boolean']['output']>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
  whatsappNumber?: Maybe<Scalars['String']['output']>;
};

export type SupplierCreateInput = {
  companyName: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['Float']['input']>;
};

export type SupplierSearchInput = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  guestCount?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  serviceQuery?: InputMaybe<Scalars['String']['input']>;
};

export type SupplierWhereInput = {
  supplierId?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  country: Scalars['String']['output'];
  customer?: Maybe<Customer>;
  email: Scalars['String']['output'];
  isAdmin?: Maybe<Scalars['Boolean']['output']>;
  isCustomer?: Maybe<Scalars['Boolean']['output']>;
  isSupplier?: Maybe<Scalars['Boolean']['output']>;
  language: Language;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  profilePicture?: Maybe<Scalars['String']['output']>;
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

export type AiCompleteMutationVariables = Exact<{
  data: AiCompletionInput;
}>;


export type AiCompleteMutation = { __typename?: 'Mutation', aiComplete: { __typename?: 'AiCompletionResult', content: string, model: string, usage?: { __typename?: 'AiMessageUsage', inputTokens?: number | null, outputTokens?: number | null } | null } };

export type AiConversationQueryVariables = Exact<{
  conversationId: Scalars['String']['input'];
  deviceId?: InputMaybe<Scalars['String']['input']>;
}>;


export type AiConversationQuery = { __typename?: 'Query', aiConversation: { __typename?: 'AiConversation', conversationId: string, title: string, model: string, deviceId: string, userId?: number | null, createdAt: any, updatedAt: any, messages?: Array<{ __typename?: 'AiMessage', messageId: string, conversationId: string, role: string, content: string, model?: string | null, inputTokens?: number | null, outputTokens?: number | null, providersJson?: string | null, createdAt: any }> | null } };

export type AiConversationsQueryVariables = Exact<{
  deviceId?: InputMaybe<Scalars['String']['input']>;
}>;


export type AiConversationsQuery = { __typename?: 'Query', aiConversations: Array<{ __typename?: 'AiConversation', conversationId: string, title: string, model: string, deviceId: string, userId?: number | null, createdAt: any, updatedAt: any, messages?: Array<{ __typename?: 'AiMessage', messageId: string, role: string, content: string, createdAt: any }> | null }> };

export type CreateAiConversationMutationVariables = Exact<{
  data: AiConversationCreateInput;
}>;


export type CreateAiConversationMutation = { __typename?: 'Mutation', createAiConversation: { __typename?: 'AiConversation', conversationId: string, title: string, model: string, deviceId: string, userId?: number | null, createdAt: any, updatedAt: any } };

export type DeleteAiConversationMutationVariables = Exact<{
  conversationId: Scalars['String']['input'];
  deviceId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAiConversationMutation = { __typename?: 'Mutation', deleteAiConversation: boolean };

export type LinkAiConversationToRequestMutationVariables = Exact<{
  data: AiConversationLinkInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
}>;


export type LinkAiConversationToRequestMutation = { __typename?: 'Mutation', linkAiConversationToRequest: { __typename?: 'AiConversation', conversationId: string, requestId?: number | null } };

export type MergeGuestAiConversationsMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type MergeGuestAiConversationsMutation = { __typename?: 'Mutation', mergeGuestAiConversations: number };

export type RollbackLastAiTurnMutationVariables = Exact<{
  conversationId: Scalars['String']['input'];
  deviceId?: InputMaybe<Scalars['String']['input']>;
}>;


export type RollbackLastAiTurnMutation = { __typename?: 'Mutation', rollbackLastAiTurn: number };

export type SendAiMessageMutationVariables = Exact<{
  data: AiMessageSendInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
}>;


export type SendAiMessageMutation = { __typename?: 'Mutation', sendAiMessage: { __typename?: 'SendAiMessageResult', messageId: string, role: string, content: string, model: string, createdAt: any, usage?: { __typename?: 'AiMessageUsage', inputTokens?: number | null, outputTokens?: number | null } | null } };

export type UpdateAiConversationMutationVariables = Exact<{
  data: AiConversationUpdateInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateAiConversationMutation = { __typename?: 'Mutation', updateAiConversation: { __typename?: 'AiConversation', conversationId: string, title: string, model: string, updatedAt: any } };

export type UpdateAiMessageProvidersMutationVariables = Exact<{
  data: AiMessageProvidersUpdateInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateAiMessageProvidersMutation = { __typename?: 'Mutation', updateAiMessageProviders: { __typename?: 'AiMessage', messageId: string, providersJson?: string | null } };

export type LoginQueryVariables = Exact<{
  data: LoginUserInput;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, email: string, language: Language, country: string, name: string, phone: string, role: Role, profilePicture?: string | null, isCustomer?: boolean | null, isSupplier?: boolean | null, isAdmin?: boolean | null, subscription?: Array<{ __typename?: 'Subscription', subscriptionId: number, status: string, startDate: any, endDate: any, plan?: { __typename?: 'Pricing', planId: number, planName: string, price: string } | null }> | null, supplier?: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string }> | null, customer?: { __typename?: 'Customer', customerId: number, defaultCity?: string | null } | null } } };

export type RefreshUserQueryVariables = Exact<{
  data: Scalars['String']['input'];
}>;


export type RefreshUserQuery = { __typename?: 'Query', refreshUser: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, email: string, language: Language, country: string, name: string, phone: string, role: Role, profilePicture?: string | null, isCustomer?: boolean | null, isSupplier?: boolean | null, isAdmin?: boolean | null, subscription?: Array<{ __typename?: 'Subscription', subscriptionId: number, status: string, startDate: any, endDate: any, plan?: { __typename?: 'Pricing', planId: number, planName: string, price: string } | null }> | null, supplier?: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string }> | null, customer?: { __typename?: 'Customer', customerId: number, defaultCity?: string | null } | null } } };

export type SignupMutationVariables = Exact<{
  data: SignUpInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'User', userId: number, email: string, name: string, role: Role, isCustomer?: boolean | null, isSupplier?: boolean | null, customer?: { __typename?: 'Customer', customerId: number } | null, supplier?: Array<{ __typename?: 'Supplier', supplierId: number }> | null } };

export type BookingQueryVariables = Exact<{
  where: BookingWhereInput;
}>;


export type BookingQuery = { __typename?: 'Query', booking: { __typename?: 'Booking', bookingId: number, requestId: number, quoteId: number, customerId: number, supplierId: number, serviceDate: any, serviceEndDate?: any | null, location: string, guestCount?: number | null, totalPrice: string, platformFee: string, supplierPayout: string, currency: string, status: BookingStatus, paymentStatus: PaymentStatus, phoneRevealedAt?: any | null, cancellationReason?: string | null, cancelledAt?: any | null, cancelledBy?: string | null, completedAt?: any | null, createdAt: any, updatedAt: any } };

export type BookingsByCustomerQueryVariables = Exact<{
  customerId: Scalars['Int']['input'];
  status?: InputMaybe<BookingStatus>;
}>;


export type BookingsByCustomerQuery = { __typename?: 'Query', bookingsByCustomer: Array<{ __typename?: 'Booking', bookingId: number, requestId: number, quoteId: number, supplierId: number, serviceDate: any, location: string, guestCount?: number | null, totalPrice: string, currency: string, status: BookingStatus, paymentStatus: PaymentStatus, createdAt: any }> };

export type BookingsBySupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
  status?: InputMaybe<BookingStatus>;
}>;


export type BookingsBySupplierQuery = { __typename?: 'Query', bookingsBySupplier: Array<{ __typename?: 'Booking', bookingId: number, requestId: number, quoteId: number, customerId: number, serviceDate: any, location: string, guestCount?: number | null, totalPrice: string, supplierPayout: string, currency: string, status: BookingStatus, paymentStatus: PaymentStatus, createdAt: any }> };

export type CancelBookingMutationVariables = Exact<{
  data: BookingCancelInput;
}>;


export type CancelBookingMutation = { __typename?: 'Mutation', cancelBooking: { __typename?: 'Booking', bookingId: number, status: BookingStatus, cancelledAt?: any | null, cancellationReason?: string | null, cancelledBy?: string | null } };

export type CompleteBookingMutationVariables = Exact<{
  data: BookingCompleteInput;
}>;


export type CompleteBookingMutation = { __typename?: 'Mutation', completeBooking: { __typename?: 'Booking', bookingId: number, status: BookingStatus, completedAt?: any | null } };

export type CalendarEventsBySupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
  from?: InputMaybe<Scalars['DateTime']['input']>;
  to?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type CalendarEventsBySupplierQuery = { __typename?: 'Query', calendarEventsBySupplier: Array<{ __typename?: 'CalendarEvent', calendarEventId: number, supplierId: number, eventType: EventType, title: string, notes?: string | null, startsAt: any, endsAt: any, allDay: boolean, timezone: string, bookingId?: number | null, quoteId?: number | null, location?: string | null, status: EventStatus }> };

export type CancelCalendarEventMutationVariables = Exact<{
  data: CalendarEventCancelInput;
}>;


export type CancelCalendarEventMutation = { __typename?: 'Mutation', cancelCalendarEvent: { __typename?: 'CalendarEvent', calendarEventId: number, status: EventStatus } };

export type CreateCalendarEventMutationVariables = Exact<{
  data: CalendarEventCreateInput;
}>;


export type CreateCalendarEventMutation = { __typename?: 'Mutation', createCalendarEvent: { __typename?: 'CalendarEvent', calendarEventId: number, supplierId: number, eventType: EventType, title: string, notes?: string | null, startsAt: any, endsAt: any, allDay: boolean, location?: string | null, status: EventStatus } };

export type AcceptQuoteMutationVariables = Exact<{
  data: QuoteAcceptInput;
}>;


export type AcceptQuoteMutation = { __typename?: 'Mutation', acceptQuote: { __typename?: 'Booking', bookingId: number, requestId: number, quoteId: number, customerId: number, supplierId: number, serviceDate: any, location: string, guestCount?: number | null, totalPrice: string, platformFee: string, supplierPayout: string, currency: string, status: BookingStatus, paymentStatus: PaymentStatus, createdAt: any } };

export type CreateQuoteMutationVariables = Exact<{
  data: QuoteCreateInput;
}>;


export type CreateQuoteMutation = { __typename?: 'Mutation', createQuote: { __typename?: 'Quote', quoteId: number, requestId: number, supplierId: number, totalPrice: string, currency: string, message?: string | null, validUntil: any, status: QuoteStatus, createdAt: any, items?: Array<{ __typename?: 'QuoteItem', quoteItemId: number, description: string, quantity: string, unitPrice: string, total: string }> | null } };

export type MarkQuotesViewedMutationVariables = Exact<{
  data: QuoteMarkViewedInput;
}>;


export type MarkQuotesViewedMutation = { __typename?: 'Mutation', markQuotesViewed: number };

export type QuoteQueryVariables = Exact<{
  where: QuoteWhereInput;
}>;


export type QuoteQuery = { __typename?: 'Query', quote: { __typename?: 'Quote', quoteId: number, requestId: number, supplierId: number, totalPrice: string, currency: string, message?: string | null, validUntil: any, status: QuoteStatus, viewedAt?: any | null, respondedAt?: any | null, createdAt: any, updatedAt: any, items?: Array<{ __typename?: 'QuoteItem', quoteItemId: number, serviceId?: number | null, description: string, quantity: string, unitPrice: string, total: string }> | null } };

export type QuotesByRequestQueryVariables = Exact<{
  requestId: Scalars['Int']['input'];
  status?: InputMaybe<QuoteStatus>;
}>;


export type QuotesByRequestQuery = { __typename?: 'Query', quotesByRequest: Array<{ __typename?: 'Quote', quoteId: number, supplierId: number, totalPrice: string, currency: string, message?: string | null, validUntil: any, status: QuoteStatus, createdAt: any }> };

export type QuotesBySupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
  status?: InputMaybe<QuoteStatus>;
}>;


export type QuotesBySupplierQuery = { __typename?: 'Query', quotesBySupplier: Array<{ __typename?: 'Quote', quoteId: number, requestId: number, totalPrice: string, currency: string, message?: string | null, validUntil: any, status: QuoteStatus, createdAt: any }> };

export type WithdrawQuoteMutationVariables = Exact<{
  data: QuoteWithdrawInput;
}>;


export type WithdrawQuoteMutation = { __typename?: 'Mutation', withdrawQuote: { __typename?: 'Quote', quoteId: number, status: QuoteStatus, respondedAt?: any | null } };

export type CloseRequestMutationVariables = Exact<{
  data: RequestCloseInput;
}>;


export type CloseRequestMutation = { __typename?: 'Mutation', closeRequest: { __typename?: 'Request', requestId: number, status: RequestStatus, closedAt?: any | null, closedReason?: string | null } };

export type CreateRequestMutationVariables = Exact<{
  data: RequestCreateInput;
}>;


export type CreateRequestMutation = { __typename?: 'Mutation', createRequest: { __typename?: 'Request', requestId: number, customerId: number, categoryId?: number | null, rawQuery: string, isComplete: boolean, city?: string | null, serviceDate?: any | null, guestCount?: number | null, budgetMin?: string | null, budgetMax?: string | null, status: RequestStatus, createdAt: any, updatedAt: any } };

export type RequestQueryVariables = Exact<{
  where: RequestWhereInput;
}>;


export type RequestQuery = { __typename?: 'Query', request: { __typename?: 'Request', requestId: number, customerId: number, categoryId?: number | null, rawQuery: string, conversationTurns: number, isComplete: boolean, city?: string | null, serviceDate?: any | null, guestCount?: number | null, budgetMin?: string | null, budgetMax?: string | null, status: RequestStatus, expiresAt?: any | null, closedAt?: any | null, closedReason?: string | null, createdAt: any, updatedAt: any, category?: { __typename?: 'Category', categoryId: number, categoryName: string } | null } };

export type RequestsByCustomerQueryVariables = Exact<{
  customerId: Scalars['Int']['input'];
  status?: InputMaybe<RequestStatus>;
}>;


export type RequestsByCustomerQuery = { __typename?: 'Query', requestsByCustomer: Array<{ __typename?: 'Request', requestId: number, rawQuery: string, city?: string | null, serviceDate?: any | null, guestCount?: number | null, budgetMin?: string | null, budgetMax?: string | null, status: RequestStatus, createdAt: any, quotes?: Array<{ __typename?: 'Quote', quoteId: number, status: QuoteStatus }> | null }> };

export type UpdateRequestStatusMutationVariables = Exact<{
  data: RequestUpdateStatusInput;
}>;


export type UpdateRequestStatusMutation = { __typename?: 'Mutation', updateRequestStatus: { __typename?: 'Request', requestId: number, status: RequestStatus, updatedAt: any } };

export type SearchSuppliersQueryVariables = Exact<{
  data: SupplierSearchInput;
}>;


export type SearchSuppliersQuery = { __typename?: 'Query', searchSuppliers: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string, slug?: string | null, tagline?: string | null, description?: string | null, city?: string | null, rating?: string | null, reviewCount?: number | null, responseTimeMinutes?: number | null, minCapacity?: number | null, maxCapacity?: number | null, verified?: boolean | null, premium?: boolean | null, businessPhone?: string | null, businessEmail?: string | null, whatsappNumber?: string | null, websiteUrl?: string | null, services?: Array<{ __typename?: 'Service', serviceId: number, name: string, description: string, basePrice: string, currency: string, pricingModel: PricingModel }> | null }> };

export type SuppliersQueryVariables = Exact<{ [key: string]: never; }>;


export type SuppliersQuery = { __typename?: 'Query', suppliers: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string }> };


export const AiCompleteDocument = gql`
    mutation aiComplete($data: AiCompletionInput!) {
  aiComplete(data: $data) {
    content
    model
    usage {
      inputTokens
      outputTokens
    }
  }
}
    `;
export type AiCompleteMutationFn = Apollo.MutationFunction<AiCompleteMutation, AiCompleteMutationVariables>;

/**
 * __useAiCompleteMutation__
 *
 * To run a mutation, you first call `useAiCompleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAiCompleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [aiCompleteMutation, { data, loading, error }] = useAiCompleteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAiCompleteMutation(baseOptions?: Apollo.MutationHookOptions<AiCompleteMutation, AiCompleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AiCompleteMutation, AiCompleteMutationVariables>(AiCompleteDocument, options);
      }
export type AiCompleteMutationHookResult = ReturnType<typeof useAiCompleteMutation>;
export type AiCompleteMutationResult = Apollo.MutationResult<AiCompleteMutation>;
export type AiCompleteMutationOptions = Apollo.BaseMutationOptions<AiCompleteMutation, AiCompleteMutationVariables>;
export const AiConversationDocument = gql`
    query aiConversation($conversationId: String!, $deviceId: String) {
  aiConversation(conversationId: $conversationId, deviceId: $deviceId) {
    conversationId
    title
    model
    deviceId
    userId
    createdAt
    updatedAt
    messages {
      messageId
      conversationId
      role
      content
      model
      inputTokens
      outputTokens
      providersJson
      createdAt
    }
  }
}
    `;

/**
 * __useAiConversationQuery__
 *
 * To run a query within a React component, call `useAiConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAiConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAiConversationQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useAiConversationQuery(baseOptions: Apollo.QueryHookOptions<AiConversationQuery, AiConversationQueryVariables> & ({ variables: AiConversationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AiConversationQuery, AiConversationQueryVariables>(AiConversationDocument, options);
      }
export function useAiConversationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AiConversationQuery, AiConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AiConversationQuery, AiConversationQueryVariables>(AiConversationDocument, options);
        }
// @ts-ignore
export function useAiConversationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AiConversationQuery, AiConversationQueryVariables>): Apollo.UseSuspenseQueryResult<AiConversationQuery, AiConversationQueryVariables>;
export function useAiConversationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AiConversationQuery, AiConversationQueryVariables>): Apollo.UseSuspenseQueryResult<AiConversationQuery | undefined, AiConversationQueryVariables>;
export function useAiConversationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AiConversationQuery, AiConversationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AiConversationQuery, AiConversationQueryVariables>(AiConversationDocument, options);
        }
export type AiConversationQueryHookResult = ReturnType<typeof useAiConversationQuery>;
export type AiConversationLazyQueryHookResult = ReturnType<typeof useAiConversationLazyQuery>;
export type AiConversationSuspenseQueryHookResult = ReturnType<typeof useAiConversationSuspenseQuery>;
export type AiConversationQueryResult = Apollo.QueryResult<AiConversationQuery, AiConversationQueryVariables>;
export const AiConversationsDocument = gql`
    query aiConversations($deviceId: String) {
  aiConversations(deviceId: $deviceId) {
    conversationId
    title
    model
    deviceId
    userId
    createdAt
    updatedAt
    messages {
      messageId
      role
      content
      createdAt
    }
  }
}
    `;

/**
 * __useAiConversationsQuery__
 *
 * To run a query within a React component, call `useAiConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAiConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAiConversationsQuery({
 *   variables: {
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useAiConversationsQuery(baseOptions?: Apollo.QueryHookOptions<AiConversationsQuery, AiConversationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AiConversationsQuery, AiConversationsQueryVariables>(AiConversationsDocument, options);
      }
export function useAiConversationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AiConversationsQuery, AiConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AiConversationsQuery, AiConversationsQueryVariables>(AiConversationsDocument, options);
        }
// @ts-ignore
export function useAiConversationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AiConversationsQuery, AiConversationsQueryVariables>): Apollo.UseSuspenseQueryResult<AiConversationsQuery, AiConversationsQueryVariables>;
export function useAiConversationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AiConversationsQuery, AiConversationsQueryVariables>): Apollo.UseSuspenseQueryResult<AiConversationsQuery | undefined, AiConversationsQueryVariables>;
export function useAiConversationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AiConversationsQuery, AiConversationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AiConversationsQuery, AiConversationsQueryVariables>(AiConversationsDocument, options);
        }
export type AiConversationsQueryHookResult = ReturnType<typeof useAiConversationsQuery>;
export type AiConversationsLazyQueryHookResult = ReturnType<typeof useAiConversationsLazyQuery>;
export type AiConversationsSuspenseQueryHookResult = ReturnType<typeof useAiConversationsSuspenseQuery>;
export type AiConversationsQueryResult = Apollo.QueryResult<AiConversationsQuery, AiConversationsQueryVariables>;
export const CreateAiConversationDocument = gql`
    mutation createAiConversation($data: AiConversationCreateInput!) {
  createAiConversation(data: $data) {
    conversationId
    title
    model
    deviceId
    userId
    createdAt
    updatedAt
  }
}
    `;
export type CreateAiConversationMutationFn = Apollo.MutationFunction<CreateAiConversationMutation, CreateAiConversationMutationVariables>;

/**
 * __useCreateAiConversationMutation__
 *
 * To run a mutation, you first call `useCreateAiConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAiConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAiConversationMutation, { data, loading, error }] = useCreateAiConversationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateAiConversationMutation(baseOptions?: Apollo.MutationHookOptions<CreateAiConversationMutation, CreateAiConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAiConversationMutation, CreateAiConversationMutationVariables>(CreateAiConversationDocument, options);
      }
export type CreateAiConversationMutationHookResult = ReturnType<typeof useCreateAiConversationMutation>;
export type CreateAiConversationMutationResult = Apollo.MutationResult<CreateAiConversationMutation>;
export type CreateAiConversationMutationOptions = Apollo.BaseMutationOptions<CreateAiConversationMutation, CreateAiConversationMutationVariables>;
export const DeleteAiConversationDocument = gql`
    mutation deleteAiConversation($conversationId: String!, $deviceId: String) {
  deleteAiConversation(conversationId: $conversationId, deviceId: $deviceId)
}
    `;
export type DeleteAiConversationMutationFn = Apollo.MutationFunction<DeleteAiConversationMutation, DeleteAiConversationMutationVariables>;

/**
 * __useDeleteAiConversationMutation__
 *
 * To run a mutation, you first call `useDeleteAiConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAiConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAiConversationMutation, { data, loading, error }] = useDeleteAiConversationMutation({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useDeleteAiConversationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAiConversationMutation, DeleteAiConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAiConversationMutation, DeleteAiConversationMutationVariables>(DeleteAiConversationDocument, options);
      }
export type DeleteAiConversationMutationHookResult = ReturnType<typeof useDeleteAiConversationMutation>;
export type DeleteAiConversationMutationResult = Apollo.MutationResult<DeleteAiConversationMutation>;
export type DeleteAiConversationMutationOptions = Apollo.BaseMutationOptions<DeleteAiConversationMutation, DeleteAiConversationMutationVariables>;
export const LinkAiConversationToRequestDocument = gql`
    mutation linkAiConversationToRequest($data: AiConversationLinkInput!, $deviceId: String) {
  linkAiConversationToRequest(data: $data, deviceId: $deviceId) {
    conversationId
    requestId
  }
}
    `;
export type LinkAiConversationToRequestMutationFn = Apollo.MutationFunction<LinkAiConversationToRequestMutation, LinkAiConversationToRequestMutationVariables>;

/**
 * __useLinkAiConversationToRequestMutation__
 *
 * To run a mutation, you first call `useLinkAiConversationToRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkAiConversationToRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkAiConversationToRequestMutation, { data, loading, error }] = useLinkAiConversationToRequestMutation({
 *   variables: {
 *      data: // value for 'data'
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useLinkAiConversationToRequestMutation(baseOptions?: Apollo.MutationHookOptions<LinkAiConversationToRequestMutation, LinkAiConversationToRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LinkAiConversationToRequestMutation, LinkAiConversationToRequestMutationVariables>(LinkAiConversationToRequestDocument, options);
      }
export type LinkAiConversationToRequestMutationHookResult = ReturnType<typeof useLinkAiConversationToRequestMutation>;
export type LinkAiConversationToRequestMutationResult = Apollo.MutationResult<LinkAiConversationToRequestMutation>;
export type LinkAiConversationToRequestMutationOptions = Apollo.BaseMutationOptions<LinkAiConversationToRequestMutation, LinkAiConversationToRequestMutationVariables>;
export const MergeGuestAiConversationsDocument = gql`
    mutation mergeGuestAiConversations($deviceId: String!) {
  mergeGuestAiConversations(deviceId: $deviceId)
}
    `;
export type MergeGuestAiConversationsMutationFn = Apollo.MutationFunction<MergeGuestAiConversationsMutation, MergeGuestAiConversationsMutationVariables>;

/**
 * __useMergeGuestAiConversationsMutation__
 *
 * To run a mutation, you first call `useMergeGuestAiConversationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMergeGuestAiConversationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mergeGuestAiConversationsMutation, { data, loading, error }] = useMergeGuestAiConversationsMutation({
 *   variables: {
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useMergeGuestAiConversationsMutation(baseOptions?: Apollo.MutationHookOptions<MergeGuestAiConversationsMutation, MergeGuestAiConversationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MergeGuestAiConversationsMutation, MergeGuestAiConversationsMutationVariables>(MergeGuestAiConversationsDocument, options);
      }
export type MergeGuestAiConversationsMutationHookResult = ReturnType<typeof useMergeGuestAiConversationsMutation>;
export type MergeGuestAiConversationsMutationResult = Apollo.MutationResult<MergeGuestAiConversationsMutation>;
export type MergeGuestAiConversationsMutationOptions = Apollo.BaseMutationOptions<MergeGuestAiConversationsMutation, MergeGuestAiConversationsMutationVariables>;
export const RollbackLastAiTurnDocument = gql`
    mutation rollbackLastAiTurn($conversationId: String!, $deviceId: String) {
  rollbackLastAiTurn(conversationId: $conversationId, deviceId: $deviceId)
}
    `;
export type RollbackLastAiTurnMutationFn = Apollo.MutationFunction<RollbackLastAiTurnMutation, RollbackLastAiTurnMutationVariables>;

/**
 * __useRollbackLastAiTurnMutation__
 *
 * To run a mutation, you first call `useRollbackLastAiTurnMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRollbackLastAiTurnMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rollbackLastAiTurnMutation, { data, loading, error }] = useRollbackLastAiTurnMutation({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useRollbackLastAiTurnMutation(baseOptions?: Apollo.MutationHookOptions<RollbackLastAiTurnMutation, RollbackLastAiTurnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RollbackLastAiTurnMutation, RollbackLastAiTurnMutationVariables>(RollbackLastAiTurnDocument, options);
      }
export type RollbackLastAiTurnMutationHookResult = ReturnType<typeof useRollbackLastAiTurnMutation>;
export type RollbackLastAiTurnMutationResult = Apollo.MutationResult<RollbackLastAiTurnMutation>;
export type RollbackLastAiTurnMutationOptions = Apollo.BaseMutationOptions<RollbackLastAiTurnMutation, RollbackLastAiTurnMutationVariables>;
export const SendAiMessageDocument = gql`
    mutation sendAiMessage($data: AiMessageSendInput!, $deviceId: String) {
  sendAiMessage(data: $data, deviceId: $deviceId) {
    messageId
    role
    content
    model
    usage {
      inputTokens
      outputTokens
    }
    createdAt
  }
}
    `;
export type SendAiMessageMutationFn = Apollo.MutationFunction<SendAiMessageMutation, SendAiMessageMutationVariables>;

/**
 * __useSendAiMessageMutation__
 *
 * To run a mutation, you first call `useSendAiMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendAiMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendAiMessageMutation, { data, loading, error }] = useSendAiMessageMutation({
 *   variables: {
 *      data: // value for 'data'
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useSendAiMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendAiMessageMutation, SendAiMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendAiMessageMutation, SendAiMessageMutationVariables>(SendAiMessageDocument, options);
      }
export type SendAiMessageMutationHookResult = ReturnType<typeof useSendAiMessageMutation>;
export type SendAiMessageMutationResult = Apollo.MutationResult<SendAiMessageMutation>;
export type SendAiMessageMutationOptions = Apollo.BaseMutationOptions<SendAiMessageMutation, SendAiMessageMutationVariables>;
export const UpdateAiConversationDocument = gql`
    mutation updateAiConversation($data: AiConversationUpdateInput!, $deviceId: String) {
  updateAiConversation(data: $data, deviceId: $deviceId) {
    conversationId
    title
    model
    updatedAt
  }
}
    `;
export type UpdateAiConversationMutationFn = Apollo.MutationFunction<UpdateAiConversationMutation, UpdateAiConversationMutationVariables>;

/**
 * __useUpdateAiConversationMutation__
 *
 * To run a mutation, you first call `useUpdateAiConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAiConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAiConversationMutation, { data, loading, error }] = useUpdateAiConversationMutation({
 *   variables: {
 *      data: // value for 'data'
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useUpdateAiConversationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAiConversationMutation, UpdateAiConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAiConversationMutation, UpdateAiConversationMutationVariables>(UpdateAiConversationDocument, options);
      }
export type UpdateAiConversationMutationHookResult = ReturnType<typeof useUpdateAiConversationMutation>;
export type UpdateAiConversationMutationResult = Apollo.MutationResult<UpdateAiConversationMutation>;
export type UpdateAiConversationMutationOptions = Apollo.BaseMutationOptions<UpdateAiConversationMutation, UpdateAiConversationMutationVariables>;
export const UpdateAiMessageProvidersDocument = gql`
    mutation updateAiMessageProviders($data: AiMessageProvidersUpdateInput!, $deviceId: String) {
  updateAiMessageProviders(data: $data, deviceId: $deviceId) {
    messageId
    providersJson
  }
}
    `;
export type UpdateAiMessageProvidersMutationFn = Apollo.MutationFunction<UpdateAiMessageProvidersMutation, UpdateAiMessageProvidersMutationVariables>;

/**
 * __useUpdateAiMessageProvidersMutation__
 *
 * To run a mutation, you first call `useUpdateAiMessageProvidersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAiMessageProvidersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAiMessageProvidersMutation, { data, loading, error }] = useUpdateAiMessageProvidersMutation({
 *   variables: {
 *      data: // value for 'data'
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useUpdateAiMessageProvidersMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAiMessageProvidersMutation, UpdateAiMessageProvidersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAiMessageProvidersMutation, UpdateAiMessageProvidersMutationVariables>(UpdateAiMessageProvidersDocument, options);
      }
export type UpdateAiMessageProvidersMutationHookResult = ReturnType<typeof useUpdateAiMessageProvidersMutation>;
export type UpdateAiMessageProvidersMutationResult = Apollo.MutationResult<UpdateAiMessageProvidersMutation>;
export type UpdateAiMessageProvidersMutationOptions = Apollo.BaseMutationOptions<UpdateAiMessageProvidersMutation, UpdateAiMessageProvidersMutationVariables>;
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
      isCustomer
      isSupplier
      isAdmin
      subscription {
        subscriptionId
        plan {
          planId
          planName
          price
        }
        status
        startDate
        endDate
      }
      supplier {
        supplierId
        companyName
      }
      customer {
        customerId
        defaultCity
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
      isCustomer
      isSupplier
      isAdmin
      subscription {
        subscriptionId
        plan {
          planId
          planName
          price
        }
        status
        startDate
        endDate
      }
      supplier {
        supplierId
        companyName
      }
      customer {
        customerId
        defaultCity
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
    email
    name
    role
    isCustomer
    isSupplier
    customer {
      customerId
    }
    supplier {
      supplierId
    }
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
export const BookingDocument = gql`
    query booking($where: BookingWhereInput!) {
  booking(where: $where) {
    bookingId
    requestId
    quoteId
    customerId
    supplierId
    serviceDate
    serviceEndDate
    location
    guestCount
    totalPrice
    platformFee
    supplierPayout
    currency
    status
    paymentStatus
    phoneRevealedAt
    cancellationReason
    cancelledAt
    cancelledBy
    completedAt
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useBookingQuery__
 *
 * To run a query within a React component, call `useBookingQuery` and pass it any options that fit your needs.
 * When your component renders, `useBookingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBookingQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useBookingQuery(baseOptions: Apollo.QueryHookOptions<BookingQuery, BookingQueryVariables> & ({ variables: BookingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BookingQuery, BookingQueryVariables>(BookingDocument, options);
      }
export function useBookingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BookingQuery, BookingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BookingQuery, BookingQueryVariables>(BookingDocument, options);
        }
// @ts-ignore
export function useBookingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BookingQuery, BookingQueryVariables>): Apollo.UseSuspenseQueryResult<BookingQuery, BookingQueryVariables>;
export function useBookingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BookingQuery, BookingQueryVariables>): Apollo.UseSuspenseQueryResult<BookingQuery | undefined, BookingQueryVariables>;
export function useBookingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BookingQuery, BookingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BookingQuery, BookingQueryVariables>(BookingDocument, options);
        }
export type BookingQueryHookResult = ReturnType<typeof useBookingQuery>;
export type BookingLazyQueryHookResult = ReturnType<typeof useBookingLazyQuery>;
export type BookingSuspenseQueryHookResult = ReturnType<typeof useBookingSuspenseQuery>;
export type BookingQueryResult = Apollo.QueryResult<BookingQuery, BookingQueryVariables>;
export const BookingsByCustomerDocument = gql`
    query bookingsByCustomer($customerId: Int!, $status: BookingStatus) {
  bookingsByCustomer(customerId: $customerId, status: $status) {
    bookingId
    requestId
    quoteId
    supplierId
    serviceDate
    location
    guestCount
    totalPrice
    currency
    status
    paymentStatus
    createdAt
  }
}
    `;

/**
 * __useBookingsByCustomerQuery__
 *
 * To run a query within a React component, call `useBookingsByCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useBookingsByCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBookingsByCustomerQuery({
 *   variables: {
 *      customerId: // value for 'customerId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useBookingsByCustomerQuery(baseOptions: Apollo.QueryHookOptions<BookingsByCustomerQuery, BookingsByCustomerQueryVariables> & ({ variables: BookingsByCustomerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BookingsByCustomerQuery, BookingsByCustomerQueryVariables>(BookingsByCustomerDocument, options);
      }
export function useBookingsByCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BookingsByCustomerQuery, BookingsByCustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BookingsByCustomerQuery, BookingsByCustomerQueryVariables>(BookingsByCustomerDocument, options);
        }
// @ts-ignore
export function useBookingsByCustomerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BookingsByCustomerQuery, BookingsByCustomerQueryVariables>): Apollo.UseSuspenseQueryResult<BookingsByCustomerQuery, BookingsByCustomerQueryVariables>;
export function useBookingsByCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BookingsByCustomerQuery, BookingsByCustomerQueryVariables>): Apollo.UseSuspenseQueryResult<BookingsByCustomerQuery | undefined, BookingsByCustomerQueryVariables>;
export function useBookingsByCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BookingsByCustomerQuery, BookingsByCustomerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BookingsByCustomerQuery, BookingsByCustomerQueryVariables>(BookingsByCustomerDocument, options);
        }
export type BookingsByCustomerQueryHookResult = ReturnType<typeof useBookingsByCustomerQuery>;
export type BookingsByCustomerLazyQueryHookResult = ReturnType<typeof useBookingsByCustomerLazyQuery>;
export type BookingsByCustomerSuspenseQueryHookResult = ReturnType<typeof useBookingsByCustomerSuspenseQuery>;
export type BookingsByCustomerQueryResult = Apollo.QueryResult<BookingsByCustomerQuery, BookingsByCustomerQueryVariables>;
export const BookingsBySupplierDocument = gql`
    query bookingsBySupplier($supplierId: Int!, $status: BookingStatus) {
  bookingsBySupplier(supplierId: $supplierId, status: $status) {
    bookingId
    requestId
    quoteId
    customerId
    serviceDate
    location
    guestCount
    totalPrice
    supplierPayout
    currency
    status
    paymentStatus
    createdAt
  }
}
    `;

/**
 * __useBookingsBySupplierQuery__
 *
 * To run a query within a React component, call `useBookingsBySupplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useBookingsBySupplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBookingsBySupplierQuery({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useBookingsBySupplierQuery(baseOptions: Apollo.QueryHookOptions<BookingsBySupplierQuery, BookingsBySupplierQueryVariables> & ({ variables: BookingsBySupplierQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BookingsBySupplierQuery, BookingsBySupplierQueryVariables>(BookingsBySupplierDocument, options);
      }
export function useBookingsBySupplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BookingsBySupplierQuery, BookingsBySupplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BookingsBySupplierQuery, BookingsBySupplierQueryVariables>(BookingsBySupplierDocument, options);
        }
// @ts-ignore
export function useBookingsBySupplierSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BookingsBySupplierQuery, BookingsBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<BookingsBySupplierQuery, BookingsBySupplierQueryVariables>;
export function useBookingsBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BookingsBySupplierQuery, BookingsBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<BookingsBySupplierQuery | undefined, BookingsBySupplierQueryVariables>;
export function useBookingsBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BookingsBySupplierQuery, BookingsBySupplierQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BookingsBySupplierQuery, BookingsBySupplierQueryVariables>(BookingsBySupplierDocument, options);
        }
export type BookingsBySupplierQueryHookResult = ReturnType<typeof useBookingsBySupplierQuery>;
export type BookingsBySupplierLazyQueryHookResult = ReturnType<typeof useBookingsBySupplierLazyQuery>;
export type BookingsBySupplierSuspenseQueryHookResult = ReturnType<typeof useBookingsBySupplierSuspenseQuery>;
export type BookingsBySupplierQueryResult = Apollo.QueryResult<BookingsBySupplierQuery, BookingsBySupplierQueryVariables>;
export const CancelBookingDocument = gql`
    mutation cancelBooking($data: BookingCancelInput!) {
  cancelBooking(data: $data) {
    bookingId
    status
    cancelledAt
    cancellationReason
    cancelledBy
  }
}
    `;
export type CancelBookingMutationFn = Apollo.MutationFunction<CancelBookingMutation, CancelBookingMutationVariables>;

/**
 * __useCancelBookingMutation__
 *
 * To run a mutation, you first call `useCancelBookingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelBookingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelBookingMutation, { data, loading, error }] = useCancelBookingMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCancelBookingMutation(baseOptions?: Apollo.MutationHookOptions<CancelBookingMutation, CancelBookingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelBookingMutation, CancelBookingMutationVariables>(CancelBookingDocument, options);
      }
export type CancelBookingMutationHookResult = ReturnType<typeof useCancelBookingMutation>;
export type CancelBookingMutationResult = Apollo.MutationResult<CancelBookingMutation>;
export type CancelBookingMutationOptions = Apollo.BaseMutationOptions<CancelBookingMutation, CancelBookingMutationVariables>;
export const CompleteBookingDocument = gql`
    mutation completeBooking($data: BookingCompleteInput!) {
  completeBooking(data: $data) {
    bookingId
    status
    completedAt
  }
}
    `;
export type CompleteBookingMutationFn = Apollo.MutationFunction<CompleteBookingMutation, CompleteBookingMutationVariables>;

/**
 * __useCompleteBookingMutation__
 *
 * To run a mutation, you first call `useCompleteBookingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteBookingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeBookingMutation, { data, loading, error }] = useCompleteBookingMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCompleteBookingMutation(baseOptions?: Apollo.MutationHookOptions<CompleteBookingMutation, CompleteBookingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteBookingMutation, CompleteBookingMutationVariables>(CompleteBookingDocument, options);
      }
export type CompleteBookingMutationHookResult = ReturnType<typeof useCompleteBookingMutation>;
export type CompleteBookingMutationResult = Apollo.MutationResult<CompleteBookingMutation>;
export type CompleteBookingMutationOptions = Apollo.BaseMutationOptions<CompleteBookingMutation, CompleteBookingMutationVariables>;
export const CalendarEventsBySupplierDocument = gql`
    query calendarEventsBySupplier($supplierId: Int!, $from: DateTime, $to: DateTime) {
  calendarEventsBySupplier(supplierId: $supplierId, from: $from, to: $to) {
    calendarEventId
    supplierId
    eventType
    title
    notes
    startsAt
    endsAt
    allDay
    timezone
    bookingId
    quoteId
    location
    status
  }
}
    `;

/**
 * __useCalendarEventsBySupplierQuery__
 *
 * To run a query within a React component, call `useCalendarEventsBySupplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useCalendarEventsBySupplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCalendarEventsBySupplierQuery({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useCalendarEventsBySupplierQuery(baseOptions: Apollo.QueryHookOptions<CalendarEventsBySupplierQuery, CalendarEventsBySupplierQueryVariables> & ({ variables: CalendarEventsBySupplierQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CalendarEventsBySupplierQuery, CalendarEventsBySupplierQueryVariables>(CalendarEventsBySupplierDocument, options);
      }
export function useCalendarEventsBySupplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CalendarEventsBySupplierQuery, CalendarEventsBySupplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CalendarEventsBySupplierQuery, CalendarEventsBySupplierQueryVariables>(CalendarEventsBySupplierDocument, options);
        }
// @ts-ignore
export function useCalendarEventsBySupplierSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CalendarEventsBySupplierQuery, CalendarEventsBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<CalendarEventsBySupplierQuery, CalendarEventsBySupplierQueryVariables>;
export function useCalendarEventsBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CalendarEventsBySupplierQuery, CalendarEventsBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<CalendarEventsBySupplierQuery | undefined, CalendarEventsBySupplierQueryVariables>;
export function useCalendarEventsBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CalendarEventsBySupplierQuery, CalendarEventsBySupplierQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CalendarEventsBySupplierQuery, CalendarEventsBySupplierQueryVariables>(CalendarEventsBySupplierDocument, options);
        }
export type CalendarEventsBySupplierQueryHookResult = ReturnType<typeof useCalendarEventsBySupplierQuery>;
export type CalendarEventsBySupplierLazyQueryHookResult = ReturnType<typeof useCalendarEventsBySupplierLazyQuery>;
export type CalendarEventsBySupplierSuspenseQueryHookResult = ReturnType<typeof useCalendarEventsBySupplierSuspenseQuery>;
export type CalendarEventsBySupplierQueryResult = Apollo.QueryResult<CalendarEventsBySupplierQuery, CalendarEventsBySupplierQueryVariables>;
export const CancelCalendarEventDocument = gql`
    mutation cancelCalendarEvent($data: CalendarEventCancelInput!) {
  cancelCalendarEvent(data: $data) {
    calendarEventId
    status
  }
}
    `;
export type CancelCalendarEventMutationFn = Apollo.MutationFunction<CancelCalendarEventMutation, CancelCalendarEventMutationVariables>;

/**
 * __useCancelCalendarEventMutation__
 *
 * To run a mutation, you first call `useCancelCalendarEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelCalendarEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelCalendarEventMutation, { data, loading, error }] = useCancelCalendarEventMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCancelCalendarEventMutation(baseOptions?: Apollo.MutationHookOptions<CancelCalendarEventMutation, CancelCalendarEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelCalendarEventMutation, CancelCalendarEventMutationVariables>(CancelCalendarEventDocument, options);
      }
export type CancelCalendarEventMutationHookResult = ReturnType<typeof useCancelCalendarEventMutation>;
export type CancelCalendarEventMutationResult = Apollo.MutationResult<CancelCalendarEventMutation>;
export type CancelCalendarEventMutationOptions = Apollo.BaseMutationOptions<CancelCalendarEventMutation, CancelCalendarEventMutationVariables>;
export const CreateCalendarEventDocument = gql`
    mutation createCalendarEvent($data: CalendarEventCreateInput!) {
  createCalendarEvent(data: $data) {
    calendarEventId
    supplierId
    eventType
    title
    notes
    startsAt
    endsAt
    allDay
    location
    status
  }
}
    `;
export type CreateCalendarEventMutationFn = Apollo.MutationFunction<CreateCalendarEventMutation, CreateCalendarEventMutationVariables>;

/**
 * __useCreateCalendarEventMutation__
 *
 * To run a mutation, you first call `useCreateCalendarEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCalendarEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCalendarEventMutation, { data, loading, error }] = useCreateCalendarEventMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateCalendarEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateCalendarEventMutation, CreateCalendarEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCalendarEventMutation, CreateCalendarEventMutationVariables>(CreateCalendarEventDocument, options);
      }
export type CreateCalendarEventMutationHookResult = ReturnType<typeof useCreateCalendarEventMutation>;
export type CreateCalendarEventMutationResult = Apollo.MutationResult<CreateCalendarEventMutation>;
export type CreateCalendarEventMutationOptions = Apollo.BaseMutationOptions<CreateCalendarEventMutation, CreateCalendarEventMutationVariables>;
export const AcceptQuoteDocument = gql`
    mutation acceptQuote($data: QuoteAcceptInput!) {
  acceptQuote(data: $data) {
    bookingId
    requestId
    quoteId
    customerId
    supplierId
    serviceDate
    location
    guestCount
    totalPrice
    platformFee
    supplierPayout
    currency
    status
    paymentStatus
    createdAt
  }
}
    `;
export type AcceptQuoteMutationFn = Apollo.MutationFunction<AcceptQuoteMutation, AcceptQuoteMutationVariables>;

/**
 * __useAcceptQuoteMutation__
 *
 * To run a mutation, you first call `useAcceptQuoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptQuoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptQuoteMutation, { data, loading, error }] = useAcceptQuoteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAcceptQuoteMutation(baseOptions?: Apollo.MutationHookOptions<AcceptQuoteMutation, AcceptQuoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptQuoteMutation, AcceptQuoteMutationVariables>(AcceptQuoteDocument, options);
      }
export type AcceptQuoteMutationHookResult = ReturnType<typeof useAcceptQuoteMutation>;
export type AcceptQuoteMutationResult = Apollo.MutationResult<AcceptQuoteMutation>;
export type AcceptQuoteMutationOptions = Apollo.BaseMutationOptions<AcceptQuoteMutation, AcceptQuoteMutationVariables>;
export const CreateQuoteDocument = gql`
    mutation createQuote($data: QuoteCreateInput!) {
  createQuote(data: $data) {
    quoteId
    requestId
    supplierId
    totalPrice
    currency
    message
    validUntil
    status
    createdAt
    items {
      quoteItemId
      description
      quantity
      unitPrice
      total
    }
  }
}
    `;
export type CreateQuoteMutationFn = Apollo.MutationFunction<CreateQuoteMutation, CreateQuoteMutationVariables>;

/**
 * __useCreateQuoteMutation__
 *
 * To run a mutation, you first call `useCreateQuoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQuoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQuoteMutation, { data, loading, error }] = useCreateQuoteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateQuoteMutation(baseOptions?: Apollo.MutationHookOptions<CreateQuoteMutation, CreateQuoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateQuoteMutation, CreateQuoteMutationVariables>(CreateQuoteDocument, options);
      }
export type CreateQuoteMutationHookResult = ReturnType<typeof useCreateQuoteMutation>;
export type CreateQuoteMutationResult = Apollo.MutationResult<CreateQuoteMutation>;
export type CreateQuoteMutationOptions = Apollo.BaseMutationOptions<CreateQuoteMutation, CreateQuoteMutationVariables>;
export const MarkQuotesViewedDocument = gql`
    mutation markQuotesViewed($data: QuoteMarkViewedInput!) {
  markQuotesViewed(data: $data)
}
    `;
export type MarkQuotesViewedMutationFn = Apollo.MutationFunction<MarkQuotesViewedMutation, MarkQuotesViewedMutationVariables>;

/**
 * __useMarkQuotesViewedMutation__
 *
 * To run a mutation, you first call `useMarkQuotesViewedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkQuotesViewedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markQuotesViewedMutation, { data, loading, error }] = useMarkQuotesViewedMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useMarkQuotesViewedMutation(baseOptions?: Apollo.MutationHookOptions<MarkQuotesViewedMutation, MarkQuotesViewedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkQuotesViewedMutation, MarkQuotesViewedMutationVariables>(MarkQuotesViewedDocument, options);
      }
export type MarkQuotesViewedMutationHookResult = ReturnType<typeof useMarkQuotesViewedMutation>;
export type MarkQuotesViewedMutationResult = Apollo.MutationResult<MarkQuotesViewedMutation>;
export type MarkQuotesViewedMutationOptions = Apollo.BaseMutationOptions<MarkQuotesViewedMutation, MarkQuotesViewedMutationVariables>;
export const QuoteDocument = gql`
    query quote($where: QuoteWhereInput!) {
  quote(where: $where) {
    quoteId
    requestId
    supplierId
    totalPrice
    currency
    message
    validUntil
    status
    viewedAt
    respondedAt
    createdAt
    updatedAt
    items {
      quoteItemId
      serviceId
      description
      quantity
      unitPrice
      total
    }
  }
}
    `;

/**
 * __useQuoteQuery__
 *
 * To run a query within a React component, call `useQuoteQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuoteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuoteQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useQuoteQuery(baseOptions: Apollo.QueryHookOptions<QuoteQuery, QuoteQueryVariables> & ({ variables: QuoteQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuoteQuery, QuoteQueryVariables>(QuoteDocument, options);
      }
export function useQuoteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuoteQuery, QuoteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuoteQuery, QuoteQueryVariables>(QuoteDocument, options);
        }
// @ts-ignore
export function useQuoteSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<QuoteQuery, QuoteQueryVariables>): Apollo.UseSuspenseQueryResult<QuoteQuery, QuoteQueryVariables>;
export function useQuoteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<QuoteQuery, QuoteQueryVariables>): Apollo.UseSuspenseQueryResult<QuoteQuery | undefined, QuoteQueryVariables>;
export function useQuoteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<QuoteQuery, QuoteQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<QuoteQuery, QuoteQueryVariables>(QuoteDocument, options);
        }
export type QuoteQueryHookResult = ReturnType<typeof useQuoteQuery>;
export type QuoteLazyQueryHookResult = ReturnType<typeof useQuoteLazyQuery>;
export type QuoteSuspenseQueryHookResult = ReturnType<typeof useQuoteSuspenseQuery>;
export type QuoteQueryResult = Apollo.QueryResult<QuoteQuery, QuoteQueryVariables>;
export const QuotesByRequestDocument = gql`
    query quotesByRequest($requestId: Int!, $status: QuoteStatus) {
  quotesByRequest(requestId: $requestId, status: $status) {
    quoteId
    supplierId
    totalPrice
    currency
    message
    validUntil
    status
    createdAt
  }
}
    `;

/**
 * __useQuotesByRequestQuery__
 *
 * To run a query within a React component, call `useQuotesByRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuotesByRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuotesByRequestQuery({
 *   variables: {
 *      requestId: // value for 'requestId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useQuotesByRequestQuery(baseOptions: Apollo.QueryHookOptions<QuotesByRequestQuery, QuotesByRequestQueryVariables> & ({ variables: QuotesByRequestQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuotesByRequestQuery, QuotesByRequestQueryVariables>(QuotesByRequestDocument, options);
      }
export function useQuotesByRequestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuotesByRequestQuery, QuotesByRequestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuotesByRequestQuery, QuotesByRequestQueryVariables>(QuotesByRequestDocument, options);
        }
// @ts-ignore
export function useQuotesByRequestSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<QuotesByRequestQuery, QuotesByRequestQueryVariables>): Apollo.UseSuspenseQueryResult<QuotesByRequestQuery, QuotesByRequestQueryVariables>;
export function useQuotesByRequestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<QuotesByRequestQuery, QuotesByRequestQueryVariables>): Apollo.UseSuspenseQueryResult<QuotesByRequestQuery | undefined, QuotesByRequestQueryVariables>;
export function useQuotesByRequestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<QuotesByRequestQuery, QuotesByRequestQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<QuotesByRequestQuery, QuotesByRequestQueryVariables>(QuotesByRequestDocument, options);
        }
export type QuotesByRequestQueryHookResult = ReturnType<typeof useQuotesByRequestQuery>;
export type QuotesByRequestLazyQueryHookResult = ReturnType<typeof useQuotesByRequestLazyQuery>;
export type QuotesByRequestSuspenseQueryHookResult = ReturnType<typeof useQuotesByRequestSuspenseQuery>;
export type QuotesByRequestQueryResult = Apollo.QueryResult<QuotesByRequestQuery, QuotesByRequestQueryVariables>;
export const QuotesBySupplierDocument = gql`
    query quotesBySupplier($supplierId: Int!, $status: QuoteStatus) {
  quotesBySupplier(supplierId: $supplierId, status: $status) {
    quoteId
    requestId
    totalPrice
    currency
    message
    validUntil
    status
    createdAt
  }
}
    `;

/**
 * __useQuotesBySupplierQuery__
 *
 * To run a query within a React component, call `useQuotesBySupplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuotesBySupplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuotesBySupplierQuery({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useQuotesBySupplierQuery(baseOptions: Apollo.QueryHookOptions<QuotesBySupplierQuery, QuotesBySupplierQueryVariables> & ({ variables: QuotesBySupplierQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuotesBySupplierQuery, QuotesBySupplierQueryVariables>(QuotesBySupplierDocument, options);
      }
export function useQuotesBySupplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuotesBySupplierQuery, QuotesBySupplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuotesBySupplierQuery, QuotesBySupplierQueryVariables>(QuotesBySupplierDocument, options);
        }
// @ts-ignore
export function useQuotesBySupplierSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<QuotesBySupplierQuery, QuotesBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<QuotesBySupplierQuery, QuotesBySupplierQueryVariables>;
export function useQuotesBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<QuotesBySupplierQuery, QuotesBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<QuotesBySupplierQuery | undefined, QuotesBySupplierQueryVariables>;
export function useQuotesBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<QuotesBySupplierQuery, QuotesBySupplierQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<QuotesBySupplierQuery, QuotesBySupplierQueryVariables>(QuotesBySupplierDocument, options);
        }
export type QuotesBySupplierQueryHookResult = ReturnType<typeof useQuotesBySupplierQuery>;
export type QuotesBySupplierLazyQueryHookResult = ReturnType<typeof useQuotesBySupplierLazyQuery>;
export type QuotesBySupplierSuspenseQueryHookResult = ReturnType<typeof useQuotesBySupplierSuspenseQuery>;
export type QuotesBySupplierQueryResult = Apollo.QueryResult<QuotesBySupplierQuery, QuotesBySupplierQueryVariables>;
export const WithdrawQuoteDocument = gql`
    mutation withdrawQuote($data: QuoteWithdrawInput!) {
  withdrawQuote(data: $data) {
    quoteId
    status
    respondedAt
  }
}
    `;
export type WithdrawQuoteMutationFn = Apollo.MutationFunction<WithdrawQuoteMutation, WithdrawQuoteMutationVariables>;

/**
 * __useWithdrawQuoteMutation__
 *
 * To run a mutation, you first call `useWithdrawQuoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWithdrawQuoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [withdrawQuoteMutation, { data, loading, error }] = useWithdrawQuoteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useWithdrawQuoteMutation(baseOptions?: Apollo.MutationHookOptions<WithdrawQuoteMutation, WithdrawQuoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WithdrawQuoteMutation, WithdrawQuoteMutationVariables>(WithdrawQuoteDocument, options);
      }
export type WithdrawQuoteMutationHookResult = ReturnType<typeof useWithdrawQuoteMutation>;
export type WithdrawQuoteMutationResult = Apollo.MutationResult<WithdrawQuoteMutation>;
export type WithdrawQuoteMutationOptions = Apollo.BaseMutationOptions<WithdrawQuoteMutation, WithdrawQuoteMutationVariables>;
export const CloseRequestDocument = gql`
    mutation closeRequest($data: RequestCloseInput!) {
  closeRequest(data: $data) {
    requestId
    status
    closedAt
    closedReason
  }
}
    `;
export type CloseRequestMutationFn = Apollo.MutationFunction<CloseRequestMutation, CloseRequestMutationVariables>;

/**
 * __useCloseRequestMutation__
 *
 * To run a mutation, you first call `useCloseRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCloseRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [closeRequestMutation, { data, loading, error }] = useCloseRequestMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCloseRequestMutation(baseOptions?: Apollo.MutationHookOptions<CloseRequestMutation, CloseRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CloseRequestMutation, CloseRequestMutationVariables>(CloseRequestDocument, options);
      }
export type CloseRequestMutationHookResult = ReturnType<typeof useCloseRequestMutation>;
export type CloseRequestMutationResult = Apollo.MutationResult<CloseRequestMutation>;
export type CloseRequestMutationOptions = Apollo.BaseMutationOptions<CloseRequestMutation, CloseRequestMutationVariables>;
export const CreateRequestDocument = gql`
    mutation createRequest($data: RequestCreateInput!) {
  createRequest(data: $data) {
    requestId
    customerId
    categoryId
    rawQuery
    isComplete
    city
    serviceDate
    guestCount
    budgetMin
    budgetMax
    status
    createdAt
    updatedAt
  }
}
    `;
export type CreateRequestMutationFn = Apollo.MutationFunction<CreateRequestMutation, CreateRequestMutationVariables>;

/**
 * __useCreateRequestMutation__
 *
 * To run a mutation, you first call `useCreateRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRequestMutation, { data, loading, error }] = useCreateRequestMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateRequestMutation, CreateRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRequestMutation, CreateRequestMutationVariables>(CreateRequestDocument, options);
      }
export type CreateRequestMutationHookResult = ReturnType<typeof useCreateRequestMutation>;
export type CreateRequestMutationResult = Apollo.MutationResult<CreateRequestMutation>;
export type CreateRequestMutationOptions = Apollo.BaseMutationOptions<CreateRequestMutation, CreateRequestMutationVariables>;
export const RequestDocument = gql`
    query request($where: RequestWhereInput!) {
  request(where: $where) {
    requestId
    customerId
    categoryId
    category {
      categoryId
      categoryName
    }
    rawQuery
    conversationTurns
    isComplete
    city
    serviceDate
    guestCount
    budgetMin
    budgetMax
    status
    expiresAt
    closedAt
    closedReason
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useRequestQuery__
 *
 * To run a query within a React component, call `useRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequestQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useRequestQuery(baseOptions: Apollo.QueryHookOptions<RequestQuery, RequestQueryVariables> & ({ variables: RequestQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RequestQuery, RequestQueryVariables>(RequestDocument, options);
      }
export function useRequestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RequestQuery, RequestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RequestQuery, RequestQueryVariables>(RequestDocument, options);
        }
// @ts-ignore
export function useRequestSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RequestQuery, RequestQueryVariables>): Apollo.UseSuspenseQueryResult<RequestQuery, RequestQueryVariables>;
export function useRequestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RequestQuery, RequestQueryVariables>): Apollo.UseSuspenseQueryResult<RequestQuery | undefined, RequestQueryVariables>;
export function useRequestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RequestQuery, RequestQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RequestQuery, RequestQueryVariables>(RequestDocument, options);
        }
export type RequestQueryHookResult = ReturnType<typeof useRequestQuery>;
export type RequestLazyQueryHookResult = ReturnType<typeof useRequestLazyQuery>;
export type RequestSuspenseQueryHookResult = ReturnType<typeof useRequestSuspenseQuery>;
export type RequestQueryResult = Apollo.QueryResult<RequestQuery, RequestQueryVariables>;
export const RequestsByCustomerDocument = gql`
    query requestsByCustomer($customerId: Int!, $status: RequestStatus) {
  requestsByCustomer(customerId: $customerId, status: $status) {
    requestId
    rawQuery
    city
    serviceDate
    guestCount
    budgetMin
    budgetMax
    status
    createdAt
    quotes {
      quoteId
      status
    }
  }
}
    `;

/**
 * __useRequestsByCustomerQuery__
 *
 * To run a query within a React component, call `useRequestsByCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequestsByCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequestsByCustomerQuery({
 *   variables: {
 *      customerId: // value for 'customerId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useRequestsByCustomerQuery(baseOptions: Apollo.QueryHookOptions<RequestsByCustomerQuery, RequestsByCustomerQueryVariables> & ({ variables: RequestsByCustomerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RequestsByCustomerQuery, RequestsByCustomerQueryVariables>(RequestsByCustomerDocument, options);
      }
export function useRequestsByCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RequestsByCustomerQuery, RequestsByCustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RequestsByCustomerQuery, RequestsByCustomerQueryVariables>(RequestsByCustomerDocument, options);
        }
// @ts-ignore
export function useRequestsByCustomerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RequestsByCustomerQuery, RequestsByCustomerQueryVariables>): Apollo.UseSuspenseQueryResult<RequestsByCustomerQuery, RequestsByCustomerQueryVariables>;
export function useRequestsByCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RequestsByCustomerQuery, RequestsByCustomerQueryVariables>): Apollo.UseSuspenseQueryResult<RequestsByCustomerQuery | undefined, RequestsByCustomerQueryVariables>;
export function useRequestsByCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RequestsByCustomerQuery, RequestsByCustomerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RequestsByCustomerQuery, RequestsByCustomerQueryVariables>(RequestsByCustomerDocument, options);
        }
export type RequestsByCustomerQueryHookResult = ReturnType<typeof useRequestsByCustomerQuery>;
export type RequestsByCustomerLazyQueryHookResult = ReturnType<typeof useRequestsByCustomerLazyQuery>;
export type RequestsByCustomerSuspenseQueryHookResult = ReturnType<typeof useRequestsByCustomerSuspenseQuery>;
export type RequestsByCustomerQueryResult = Apollo.QueryResult<RequestsByCustomerQuery, RequestsByCustomerQueryVariables>;
export const UpdateRequestStatusDocument = gql`
    mutation updateRequestStatus($data: RequestUpdateStatusInput!) {
  updateRequestStatus(data: $data) {
    requestId
    status
    updatedAt
  }
}
    `;
export type UpdateRequestStatusMutationFn = Apollo.MutationFunction<UpdateRequestStatusMutation, UpdateRequestStatusMutationVariables>;

/**
 * __useUpdateRequestStatusMutation__
 *
 * To run a mutation, you first call `useUpdateRequestStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRequestStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRequestStatusMutation, { data, loading, error }] = useUpdateRequestStatusMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateRequestStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRequestStatusMutation, UpdateRequestStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRequestStatusMutation, UpdateRequestStatusMutationVariables>(UpdateRequestStatusDocument, options);
      }
export type UpdateRequestStatusMutationHookResult = ReturnType<typeof useUpdateRequestStatusMutation>;
export type UpdateRequestStatusMutationResult = Apollo.MutationResult<UpdateRequestStatusMutation>;
export type UpdateRequestStatusMutationOptions = Apollo.BaseMutationOptions<UpdateRequestStatusMutation, UpdateRequestStatusMutationVariables>;
export const SearchSuppliersDocument = gql`
    query searchSuppliers($data: SupplierSearchInput!) {
  searchSuppliers(data: $data) {
    supplierId
    companyName
    slug
    tagline
    description
    city
    rating
    reviewCount
    responseTimeMinutes
    minCapacity
    maxCapacity
    verified
    premium
    businessPhone
    businessEmail
    whatsappNumber
    websiteUrl
    services {
      serviceId
      name
      description
      basePrice
      currency
      pricingModel
    }
  }
}
    `;

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
    query suppliers {
  suppliers {
    supplierId
    companyName
  }
}
    `;

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
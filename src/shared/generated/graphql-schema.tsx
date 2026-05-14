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

export type Booking = {
  __typename?: 'Booking';
  bookingId: Scalars['Float']['output'];
  cancellationReason?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  cancelledBy?: Maybe<Scalars['String']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  customer?: Maybe<Customer>;
  customerId: Scalars['Float']['output'];
  guestCount?: Maybe<Scalars['Float']['output']>;
  location: Scalars['String']['output'];
  paymentStatus: PaymentStatus;
  phoneRevealedAt?: Maybe<Scalars['DateTime']['output']>;
  platformFee: Scalars['String']['output'];
  quoteId: Scalars['Float']['output'];
  request?: Maybe<Request>;
  requestId: Scalars['Float']['output'];
  serviceDate: Scalars['DateTime']['output'];
  serviceEndDate?: Maybe<Scalars['DateTime']['output']>;
  status: BookingStatus;
  supplier?: Maybe<Supplier>;
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

export type Conversation = {
  __typename?: 'Conversation';
  contactShareWarnings: Scalars['Float']['output'];
  conversationId: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  customer?: Maybe<Customer>;
  customerId: Scalars['Float']['output'];
  lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  messages?: Maybe<Array<Message>>;
  request?: Maybe<Request>;
  requestId: Scalars['Float']['output'];
  status: ConversationStatus;
  supplier?: Maybe<Supplier>;
  supplierId: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ConversationArchiveInput = {
  conversationId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type ConversationCreateInput = {
  requestId: Scalars['Int']['input'];
  supplierId: Scalars['Int']['input'];
};

export type ConversationRestoreInput = {
  conversationId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

/** Lifecycle status of a customer↔supplier conversation */
export enum ConversationStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Blocked = 'BLOCKED'
}

export type ConversationWhereInput = {
  conversationId?: InputMaybe<Scalars['Int']['input']>;
};

export type Customer = {
  __typename?: 'Customer';
  createdAt: Scalars['DateTime']['output'];
  customerId: Scalars['Float']['output'];
  defaultCity?: Maybe<Scalars['String']['output']>;
  marketingOptIn: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
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

export type MarkMessagesReadInput = {
  conversationId: Scalars['Int']['input'];
  viewerUserId: Scalars['Int']['input'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  conversationId: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  filtered: Scalars['Boolean']['output'];
  filteredReason?: Maybe<Scalars['String']['output']>;
  messageId: Scalars['Float']['output'];
  messageType: MessageType;
  readAt?: Maybe<Scalars['DateTime']['output']>;
  senderType: SenderType;
  senderUserId?: Maybe<Scalars['Float']['output']>;
};

export type MessageSendInput = {
  content: Scalars['String']['input'];
  conversationId: Scalars['Int']['input'];
  messageType?: InputMaybe<MessageType>;
  senderUserId: Scalars['Int']['input'];
};

/** Format of a chat message */
export enum MessageType {
  BookingReference = 'BOOKING_REFERENCE',
  Image = 'IMAGE',
  QuoteReference = 'QUOTE_REFERENCE',
  SystemNotice = 'SYSTEM_NOTICE',
  Text = 'TEXT'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptQuote: Booking;
  archiveConversation: Conversation;
  cancelBooking: Booking;
  cancelCalendarEvent: CalendarEvent;
  closeRequest: Request;
  completeBooking: Booking;
  createCalendarEvent: CalendarEvent;
  createCategory: Category;
  createConversation: Conversation;
  createPost: Post;
  createPricing: Pricing;
  createQuote: Quote;
  createRequest: Request;
  createSubscription: Subscription;
  createSupplier: Supplier;
  createUser: User;
  deletePost: Scalars['Boolean']['output'];
  markMessagesAsRead: Scalars['Float']['output'];
  markQuotesViewed: Scalars['Float']['output'];
  restoreConversation: Conversation;
  sendMessage: Message;
  signup: User;
  updateCalendarEvent: CalendarEvent;
  updatePost: Post;
  updateRequestStatus: Request;
  withdrawQuote: Quote;
};


export type MutationAcceptQuoteArgs = {
  data: QuoteAcceptInput;
};


export type MutationArchiveConversationArgs = {
  data: ConversationArchiveInput;
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


export type MutationCreateCalendarEventArgs = {
  data: CalendarEventCreateInput;
};


export type MutationCreateCategoryArgs = {
  data: CategoryCreateInput;
};


export type MutationCreateConversationArgs = {
  data: ConversationCreateInput;
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


export type MutationDeletePostArgs = {
  whereUnique: PostWhereUniqueInput;
};


export type MutationMarkMessagesAsReadArgs = {
  data: MarkMessagesReadInput;
};


export type MutationMarkQuotesViewedArgs = {
  data: QuoteMarkViewedInput;
};


export type MutationRestoreConversationArgs = {
  data: ConversationRestoreInput;
};


export type MutationSendMessageArgs = {
  data: MessageSendInput;
};


export type MutationSignupArgs = {
  data: SignUpInput;
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
  booking: Booking;
  bookingsByCustomer: Array<Booking>;
  bookingsBySupplier: Array<Booking>;
  calendarEvent: CalendarEvent;
  calendarEventsBySupplier: Array<CalendarEvent>;
  category: Category;
  conversation: Conversation;
  conversationsByCustomer: Array<Conversation>;
  conversationsBySupplier: Array<Conversation>;
  login: LoginOutput;
  messagesByConversation: Array<Message>;
  post: Post;
  postsBySupplier: Array<Post>;
  pricing: Pricing;
  quote: Quote;
  quotesByRequest: Array<Quote>;
  quotesBySupplier: Array<Quote>;
  refreshUser: LoginOutput;
  request: Request;
  requestsByCustomer: Array<Request>;
  requestsBySupplier: Array<Request>;
  search: Search;
  searchSuppliers: Array<Supplier>;
  subscription: Subscription;
  supplier: Supplier;
  suppliers: Array<Supplier>;
  user: User;
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


export type QueryConversationArgs = {
  where: ConversationWhereInput;
};


export type QueryConversationsByCustomerArgs = {
  customerId: Scalars['Int']['input'];
  status?: InputMaybe<ConversationStatus>;
  viewerUserId: Scalars['Int']['input'];
};


export type QueryConversationsBySupplierArgs = {
  status?: InputMaybe<ConversationStatus>;
  supplierId: Scalars['Int']['input'];
  viewerUserId: Scalars['Int']['input'];
};


export type QueryLoginArgs = {
  data: LoginUserInput;
};


export type QueryMessagesByConversationArgs = {
  conversationId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryRequestsBySupplierArgs = {
  status?: InputMaybe<RequestStatus>;
  supplierId: Scalars['Int']['input'];
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
  request?: Maybe<Request>;
  requestId: Scalars['Float']['output'];
  respondedAt?: Maybe<Scalars['DateTime']['output']>;
  status: QuoteStatus;
  supplier?: Maybe<Supplier>;
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
  customer?: Maybe<Customer>;
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

/** Who sent a message in a customer↔supplier conversation */
export enum SenderType {
  Ai = 'AI',
  Customer = 'CUSTOMER',
  Supplier = 'SUPPLIER',
  System = 'SYSTEM'
}

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


export type BookingsByCustomerQuery = { __typename?: 'Query', bookingsByCustomer: Array<{ __typename?: 'Booking', bookingId: number, requestId: number, quoteId: number, supplierId: number, serviceDate: any, location: string, guestCount?: number | null, totalPrice: string, currency: string, status: BookingStatus, paymentStatus: PaymentStatus, createdAt: any, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string } | null, request?: { __typename?: 'Request', requestId: number, rawQuery: string } | null }> };

export type BookingsBySupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
  status?: InputMaybe<BookingStatus>;
}>;


export type BookingsBySupplierQuery = { __typename?: 'Query', bookingsBySupplier: Array<{ __typename?: 'Booking', bookingId: number, requestId: number, quoteId: number, customerId: number, serviceDate: any, location: string, guestCount?: number | null, totalPrice: string, supplierPayout: string, currency: string, status: BookingStatus, paymentStatus: PaymentStatus, createdAt: any, customer?: { __typename?: 'Customer', customerId: number, user?: { __typename?: 'User', userId: number, name: string } | null } | null, request?: { __typename?: 'Request', requestId: number, rawQuery: string } | null }> };

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

export type ArchiveConversationMutationVariables = Exact<{
  data: ConversationArchiveInput;
}>;


export type ArchiveConversationMutation = { __typename?: 'Mutation', archiveConversation: { __typename?: 'Conversation', conversationId: number, status: ConversationStatus } };

export type ConversationQueryVariables = Exact<{
  where: ConversationWhereInput;
}>;


export type ConversationQuery = { __typename?: 'Query', conversation: { __typename?: 'Conversation', conversationId: number, requestId: number, customerId: number, supplierId: number, status: ConversationStatus, lastMessageAt?: any | null, contactShareWarnings: number, createdAt: any, updatedAt: any } };

export type ConversationsByCustomerQueryVariables = Exact<{
  customerId: Scalars['Int']['input'];
  viewerUserId: Scalars['Int']['input'];
  status?: InputMaybe<ConversationStatus>;
}>;


export type ConversationsByCustomerQuery = { __typename?: 'Query', conversationsByCustomer: Array<{ __typename?: 'Conversation', conversationId: number, requestId: number, customerId: number, supplierId: number, status: ConversationStatus, lastMessageAt?: any | null, contactShareWarnings: number, createdAt: any, updatedAt: any, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string } | null, request?: { __typename?: 'Request', requestId: number, rawQuery: string } | null }> };

export type ConversationsBySupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
  viewerUserId: Scalars['Int']['input'];
  status?: InputMaybe<ConversationStatus>;
}>;


export type ConversationsBySupplierQuery = { __typename?: 'Query', conversationsBySupplier: Array<{ __typename?: 'Conversation', conversationId: number, requestId: number, customerId: number, supplierId: number, status: ConversationStatus, lastMessageAt?: any | null, contactShareWarnings: number, createdAt: any, updatedAt: any, customer?: { __typename?: 'Customer', customerId: number, user?: { __typename?: 'User', userId: number, name: string } | null } | null, request?: { __typename?: 'Request', requestId: number, rawQuery: string } | null }> };

export type CreateConversationMutationVariables = Exact<{
  data: ConversationCreateInput;
}>;


export type CreateConversationMutation = { __typename?: 'Mutation', createConversation: { __typename?: 'Conversation', conversationId: number, requestId: number, customerId: number, supplierId: number, status: ConversationStatus, createdAt: any } };

export type MarkMessagesAsReadMutationVariables = Exact<{
  data: MarkMessagesReadInput;
}>;


export type MarkMessagesAsReadMutation = { __typename?: 'Mutation', markMessagesAsRead: number };

export type MessagesByConversationQueryVariables = Exact<{
  conversationId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MessagesByConversationQuery = { __typename?: 'Query', messagesByConversation: Array<{ __typename?: 'Message', messageId: number, conversationId: number, senderType: SenderType, senderUserId?: number | null, content: string, messageType: MessageType, filtered: boolean, filteredReason?: string | null, readAt?: any | null, createdAt: any }> };

export type RestoreConversationMutationVariables = Exact<{
  data: ConversationRestoreInput;
}>;


export type RestoreConversationMutation = { __typename?: 'Mutation', restoreConversation: { __typename?: 'Conversation', conversationId: number, status: ConversationStatus } };

export type SendMessageMutationVariables = Exact<{
  data: MessageSendInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'Message', messageId: number, conversationId: number, senderType: SenderType, senderUserId?: number | null, content: string, messageType: MessageType, filtered: boolean, filteredReason?: string | null, createdAt: any } };

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


export type QuotesByRequestQuery = { __typename?: 'Query', quotesByRequest: Array<{ __typename?: 'Quote', quoteId: number, supplierId: number, totalPrice: string, currency: string, message?: string | null, validUntil: any, status: QuoteStatus, createdAt: any, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string, city?: string | null, rating?: string | null, reviewCount?: number | null } | null }> };

export type QuotesBySupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
  status?: InputMaybe<QuoteStatus>;
}>;


export type QuotesBySupplierQuery = { __typename?: 'Query', quotesBySupplier: Array<{ __typename?: 'Quote', quoteId: number, requestId: number, totalPrice: string, currency: string, message?: string | null, validUntil: any, status: QuoteStatus, createdAt: any, request?: { __typename?: 'Request', requestId: number, rawQuery: string, city?: string | null, customer?: { __typename?: 'Customer', customerId: number, user?: { __typename?: 'User', userId: number, name: string } | null } | null } | null }> };

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

export type RequestsBySupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
  status?: InputMaybe<RequestStatus>;
}>;


export type RequestsBySupplierQuery = { __typename?: 'Query', requestsBySupplier: Array<{ __typename?: 'Request', requestId: number, customerId: number, rawQuery: string, city?: string | null, serviceDate?: any | null, guestCount?: number | null, budgetMin?: string | null, budgetMax?: string | null, status: RequestStatus, createdAt: any, quotes?: Array<{ __typename?: 'Quote', quoteId: number, status: QuoteStatus, supplierId: number }> | null, customer?: { __typename?: 'Customer', customerId: number, user?: { __typename?: 'User', userId: number, name: string } | null } | null }> };

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
    supplier {
      supplierId
      companyName
    }
    request {
      requestId
      rawQuery
    }
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
    customer {
      customerId
      user {
        userId
        name
      }
    }
    request {
      requestId
      rawQuery
    }
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
export const ArchiveConversationDocument = gql`
    mutation archiveConversation($data: ConversationArchiveInput!) {
  archiveConversation(data: $data) {
    conversationId
    status
  }
}
    `;
export type ArchiveConversationMutationFn = Apollo.MutationFunction<ArchiveConversationMutation, ArchiveConversationMutationVariables>;

/**
 * __useArchiveConversationMutation__
 *
 * To run a mutation, you first call `useArchiveConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveConversationMutation, { data, loading, error }] = useArchiveConversationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useArchiveConversationMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveConversationMutation, ArchiveConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveConversationMutation, ArchiveConversationMutationVariables>(ArchiveConversationDocument, options);
      }
export type ArchiveConversationMutationHookResult = ReturnType<typeof useArchiveConversationMutation>;
export type ArchiveConversationMutationResult = Apollo.MutationResult<ArchiveConversationMutation>;
export type ArchiveConversationMutationOptions = Apollo.BaseMutationOptions<ArchiveConversationMutation, ArchiveConversationMutationVariables>;
export const ConversationDocument = gql`
    query conversation($where: ConversationWhereInput!) {
  conversation(where: $where) {
    conversationId
    requestId
    customerId
    supplierId
    status
    lastMessageAt
    contactShareWarnings
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useConversationQuery__
 *
 * To run a query within a React component, call `useConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConversationQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useConversationQuery(baseOptions: Apollo.QueryHookOptions<ConversationQuery, ConversationQueryVariables> & ({ variables: ConversationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConversationQuery, ConversationQueryVariables>(ConversationDocument, options);
      }
export function useConversationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConversationQuery, ConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConversationQuery, ConversationQueryVariables>(ConversationDocument, options);
        }
// @ts-ignore
export function useConversationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ConversationQuery, ConversationQueryVariables>): Apollo.UseSuspenseQueryResult<ConversationQuery, ConversationQueryVariables>;
export function useConversationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ConversationQuery, ConversationQueryVariables>): Apollo.UseSuspenseQueryResult<ConversationQuery | undefined, ConversationQueryVariables>;
export function useConversationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ConversationQuery, ConversationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ConversationQuery, ConversationQueryVariables>(ConversationDocument, options);
        }
export type ConversationQueryHookResult = ReturnType<typeof useConversationQuery>;
export type ConversationLazyQueryHookResult = ReturnType<typeof useConversationLazyQuery>;
export type ConversationSuspenseQueryHookResult = ReturnType<typeof useConversationSuspenseQuery>;
export type ConversationQueryResult = Apollo.QueryResult<ConversationQuery, ConversationQueryVariables>;
export const ConversationsByCustomerDocument = gql`
    query conversationsByCustomer($customerId: Int!, $viewerUserId: Int!, $status: ConversationStatus) {
  conversationsByCustomer(
    customerId: $customerId
    viewerUserId: $viewerUserId
    status: $status
  ) {
    conversationId
    requestId
    customerId
    supplierId
    status
    lastMessageAt
    contactShareWarnings
    createdAt
    updatedAt
    supplier {
      supplierId
      companyName
    }
    request {
      requestId
      rawQuery
    }
  }
}
    `;

/**
 * __useConversationsByCustomerQuery__
 *
 * To run a query within a React component, call `useConversationsByCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useConversationsByCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConversationsByCustomerQuery({
 *   variables: {
 *      customerId: // value for 'customerId'
 *      viewerUserId: // value for 'viewerUserId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useConversationsByCustomerQuery(baseOptions: Apollo.QueryHookOptions<ConversationsByCustomerQuery, ConversationsByCustomerQueryVariables> & ({ variables: ConversationsByCustomerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConversationsByCustomerQuery, ConversationsByCustomerQueryVariables>(ConversationsByCustomerDocument, options);
      }
export function useConversationsByCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConversationsByCustomerQuery, ConversationsByCustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConversationsByCustomerQuery, ConversationsByCustomerQueryVariables>(ConversationsByCustomerDocument, options);
        }
// @ts-ignore
export function useConversationsByCustomerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ConversationsByCustomerQuery, ConversationsByCustomerQueryVariables>): Apollo.UseSuspenseQueryResult<ConversationsByCustomerQuery, ConversationsByCustomerQueryVariables>;
export function useConversationsByCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ConversationsByCustomerQuery, ConversationsByCustomerQueryVariables>): Apollo.UseSuspenseQueryResult<ConversationsByCustomerQuery | undefined, ConversationsByCustomerQueryVariables>;
export function useConversationsByCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ConversationsByCustomerQuery, ConversationsByCustomerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ConversationsByCustomerQuery, ConversationsByCustomerQueryVariables>(ConversationsByCustomerDocument, options);
        }
export type ConversationsByCustomerQueryHookResult = ReturnType<typeof useConversationsByCustomerQuery>;
export type ConversationsByCustomerLazyQueryHookResult = ReturnType<typeof useConversationsByCustomerLazyQuery>;
export type ConversationsByCustomerSuspenseQueryHookResult = ReturnType<typeof useConversationsByCustomerSuspenseQuery>;
export type ConversationsByCustomerQueryResult = Apollo.QueryResult<ConversationsByCustomerQuery, ConversationsByCustomerQueryVariables>;
export const ConversationsBySupplierDocument = gql`
    query conversationsBySupplier($supplierId: Int!, $viewerUserId: Int!, $status: ConversationStatus) {
  conversationsBySupplier(
    supplierId: $supplierId
    viewerUserId: $viewerUserId
    status: $status
  ) {
    conversationId
    requestId
    customerId
    supplierId
    status
    lastMessageAt
    contactShareWarnings
    createdAt
    updatedAt
    customer {
      customerId
      user {
        userId
        name
      }
    }
    request {
      requestId
      rawQuery
    }
  }
}
    `;

/**
 * __useConversationsBySupplierQuery__
 *
 * To run a query within a React component, call `useConversationsBySupplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useConversationsBySupplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConversationsBySupplierQuery({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *      viewerUserId: // value for 'viewerUserId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useConversationsBySupplierQuery(baseOptions: Apollo.QueryHookOptions<ConversationsBySupplierQuery, ConversationsBySupplierQueryVariables> & ({ variables: ConversationsBySupplierQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConversationsBySupplierQuery, ConversationsBySupplierQueryVariables>(ConversationsBySupplierDocument, options);
      }
export function useConversationsBySupplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConversationsBySupplierQuery, ConversationsBySupplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConversationsBySupplierQuery, ConversationsBySupplierQueryVariables>(ConversationsBySupplierDocument, options);
        }
// @ts-ignore
export function useConversationsBySupplierSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ConversationsBySupplierQuery, ConversationsBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<ConversationsBySupplierQuery, ConversationsBySupplierQueryVariables>;
export function useConversationsBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ConversationsBySupplierQuery, ConversationsBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<ConversationsBySupplierQuery | undefined, ConversationsBySupplierQueryVariables>;
export function useConversationsBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ConversationsBySupplierQuery, ConversationsBySupplierQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ConversationsBySupplierQuery, ConversationsBySupplierQueryVariables>(ConversationsBySupplierDocument, options);
        }
export type ConversationsBySupplierQueryHookResult = ReturnType<typeof useConversationsBySupplierQuery>;
export type ConversationsBySupplierLazyQueryHookResult = ReturnType<typeof useConversationsBySupplierLazyQuery>;
export type ConversationsBySupplierSuspenseQueryHookResult = ReturnType<typeof useConversationsBySupplierSuspenseQuery>;
export type ConversationsBySupplierQueryResult = Apollo.QueryResult<ConversationsBySupplierQuery, ConversationsBySupplierQueryVariables>;
export const CreateConversationDocument = gql`
    mutation createConversation($data: ConversationCreateInput!) {
  createConversation(data: $data) {
    conversationId
    requestId
    customerId
    supplierId
    status
    createdAt
  }
}
    `;
export type CreateConversationMutationFn = Apollo.MutationFunction<CreateConversationMutation, CreateConversationMutationVariables>;

/**
 * __useCreateConversationMutation__
 *
 * To run a mutation, you first call `useCreateConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConversationMutation, { data, loading, error }] = useCreateConversationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateConversationMutation(baseOptions?: Apollo.MutationHookOptions<CreateConversationMutation, CreateConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateConversationMutation, CreateConversationMutationVariables>(CreateConversationDocument, options);
      }
export type CreateConversationMutationHookResult = ReturnType<typeof useCreateConversationMutation>;
export type CreateConversationMutationResult = Apollo.MutationResult<CreateConversationMutation>;
export type CreateConversationMutationOptions = Apollo.BaseMutationOptions<CreateConversationMutation, CreateConversationMutationVariables>;
export const MarkMessagesAsReadDocument = gql`
    mutation markMessagesAsRead($data: MarkMessagesReadInput!) {
  markMessagesAsRead(data: $data)
}
    `;
export type MarkMessagesAsReadMutationFn = Apollo.MutationFunction<MarkMessagesAsReadMutation, MarkMessagesAsReadMutationVariables>;

/**
 * __useMarkMessagesAsReadMutation__
 *
 * To run a mutation, you first call `useMarkMessagesAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkMessagesAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markMessagesAsReadMutation, { data, loading, error }] = useMarkMessagesAsReadMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useMarkMessagesAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkMessagesAsReadMutation, MarkMessagesAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkMessagesAsReadMutation, MarkMessagesAsReadMutationVariables>(MarkMessagesAsReadDocument, options);
      }
export type MarkMessagesAsReadMutationHookResult = ReturnType<typeof useMarkMessagesAsReadMutation>;
export type MarkMessagesAsReadMutationResult = Apollo.MutationResult<MarkMessagesAsReadMutation>;
export type MarkMessagesAsReadMutationOptions = Apollo.BaseMutationOptions<MarkMessagesAsReadMutation, MarkMessagesAsReadMutationVariables>;
export const MessagesByConversationDocument = gql`
    query messagesByConversation($conversationId: Int!, $limit: Int) {
  messagesByConversation(conversationId: $conversationId, limit: $limit) {
    messageId
    conversationId
    senderType
    senderUserId
    content
    messageType
    filtered
    filteredReason
    readAt
    createdAt
  }
}
    `;

/**
 * __useMessagesByConversationQuery__
 *
 * To run a query within a React component, call `useMessagesByConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesByConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesByConversationQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useMessagesByConversationQuery(baseOptions: Apollo.QueryHookOptions<MessagesByConversationQuery, MessagesByConversationQueryVariables> & ({ variables: MessagesByConversationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessagesByConversationQuery, MessagesByConversationQueryVariables>(MessagesByConversationDocument, options);
      }
export function useMessagesByConversationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesByConversationQuery, MessagesByConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessagesByConversationQuery, MessagesByConversationQueryVariables>(MessagesByConversationDocument, options);
        }
// @ts-ignore
export function useMessagesByConversationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MessagesByConversationQuery, MessagesByConversationQueryVariables>): Apollo.UseSuspenseQueryResult<MessagesByConversationQuery, MessagesByConversationQueryVariables>;
export function useMessagesByConversationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MessagesByConversationQuery, MessagesByConversationQueryVariables>): Apollo.UseSuspenseQueryResult<MessagesByConversationQuery | undefined, MessagesByConversationQueryVariables>;
export function useMessagesByConversationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MessagesByConversationQuery, MessagesByConversationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MessagesByConversationQuery, MessagesByConversationQueryVariables>(MessagesByConversationDocument, options);
        }
export type MessagesByConversationQueryHookResult = ReturnType<typeof useMessagesByConversationQuery>;
export type MessagesByConversationLazyQueryHookResult = ReturnType<typeof useMessagesByConversationLazyQuery>;
export type MessagesByConversationSuspenseQueryHookResult = ReturnType<typeof useMessagesByConversationSuspenseQuery>;
export type MessagesByConversationQueryResult = Apollo.QueryResult<MessagesByConversationQuery, MessagesByConversationQueryVariables>;
export const RestoreConversationDocument = gql`
    mutation restoreConversation($data: ConversationRestoreInput!) {
  restoreConversation(data: $data) {
    conversationId
    status
  }
}
    `;
export type RestoreConversationMutationFn = Apollo.MutationFunction<RestoreConversationMutation, RestoreConversationMutationVariables>;

/**
 * __useRestoreConversationMutation__
 *
 * To run a mutation, you first call `useRestoreConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRestoreConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [restoreConversationMutation, { data, loading, error }] = useRestoreConversationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRestoreConversationMutation(baseOptions?: Apollo.MutationHookOptions<RestoreConversationMutation, RestoreConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RestoreConversationMutation, RestoreConversationMutationVariables>(RestoreConversationDocument, options);
      }
export type RestoreConversationMutationHookResult = ReturnType<typeof useRestoreConversationMutation>;
export type RestoreConversationMutationResult = Apollo.MutationResult<RestoreConversationMutation>;
export type RestoreConversationMutationOptions = Apollo.BaseMutationOptions<RestoreConversationMutation, RestoreConversationMutationVariables>;
export const SendMessageDocument = gql`
    mutation sendMessage($data: MessageSendInput!) {
  sendMessage(data: $data) {
    messageId
    conversationId
    senderType
    senderUserId
    content
    messageType
    filtered
    filteredReason
    createdAt
  }
}
    `;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
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
    supplier {
      supplierId
      companyName
      city
      rating
      reviewCount
    }
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
    request {
      requestId
      rawQuery
      city
      customer {
        customerId
        user {
          userId
          name
        }
      }
    }
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
export const RequestsBySupplierDocument = gql`
    query requestsBySupplier($supplierId: Int!, $status: RequestStatus) {
  requestsBySupplier(supplierId: $supplierId, status: $status) {
    requestId
    customerId
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
      supplierId
    }
    customer {
      customerId
      user {
        userId
        name
      }
    }
  }
}
    `;

/**
 * __useRequestsBySupplierQuery__
 *
 * To run a query within a React component, call `useRequestsBySupplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequestsBySupplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequestsBySupplierQuery({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useRequestsBySupplierQuery(baseOptions: Apollo.QueryHookOptions<RequestsBySupplierQuery, RequestsBySupplierQueryVariables> & ({ variables: RequestsBySupplierQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RequestsBySupplierQuery, RequestsBySupplierQueryVariables>(RequestsBySupplierDocument, options);
      }
export function useRequestsBySupplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RequestsBySupplierQuery, RequestsBySupplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RequestsBySupplierQuery, RequestsBySupplierQueryVariables>(RequestsBySupplierDocument, options);
        }
// @ts-ignore
export function useRequestsBySupplierSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RequestsBySupplierQuery, RequestsBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<RequestsBySupplierQuery, RequestsBySupplierQueryVariables>;
export function useRequestsBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RequestsBySupplierQuery, RequestsBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<RequestsBySupplierQuery | undefined, RequestsBySupplierQueryVariables>;
export function useRequestsBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RequestsBySupplierQuery, RequestsBySupplierQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RequestsBySupplierQuery, RequestsBySupplierQueryVariables>(RequestsBySupplierDocument, options);
        }
export type RequestsBySupplierQueryHookResult = ReturnType<typeof useRequestsBySupplierQuery>;
export type RequestsBySupplierLazyQueryHookResult = ReturnType<typeof useRequestsBySupplierLazyQuery>;
export type RequestsBySupplierSuspenseQueryHookResult = ReturnType<typeof useRequestsBySupplierSuspenseQuery>;
export type RequestsBySupplierQueryResult = Apollo.QueryResult<RequestsBySupplierQuery, RequestsBySupplierQueryVariables>;
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
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

export type AdminStats = {
  __typename?: 'AdminStats';
  allTimeRevenue: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  mtdRevenue: Scalars['String']['output'];
  totalBookings: Scalars['Int']['output'];
  totalCustomers: Scalars['Int']['output'];
  totalSuppliers: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
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

export type AiUsageBreakdownRow = {
  __typename?: 'AiUsageBreakdownRow';
  costUsd: Scalars['String']['output'];
  inputTokens: Scalars['Int']['output'];
  modelName: Scalars['String']['output'];
  outputTokens: Scalars['Int']['output'];
  requests: Scalars['Int']['output'];
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
  quote?: Maybe<Quote>;
  quoteId: Scalars['Float']['output'];
  request?: Maybe<Request>;
  requestId: Scalars['Float']['output'];
  review?: Maybe<Review>;
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

export type BookingEvent = {
  __typename?: 'BookingEvent';
  bookingId: Scalars['Int']['output'];
  eventType: Scalars['String']['output'];
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

export type CompleteOnboardingInput = {
  companyName?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role: Scalars['String']['input'];
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
  defaultAddress?: Maybe<Scalars['String']['output']>;
  defaultCity?: Maybe<Scalars['String']['output']>;
  marketingOptIn: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId: Scalars['Float']['output'];
};

export type CustomerUpdateInput = {
  customerId: Scalars['Int']['input'];
  defaultAddress?: InputMaybe<Scalars['String']['input']>;
  defaultCity?: InputMaybe<Scalars['String']['input']>;
  marketingOptIn?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CustomerWhereInput = {
  customerId?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
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

export type Favorite = {
  __typename?: 'Favorite';
  createdAt: Scalars['DateTime']['output'];
  customerId: Scalars['Int']['output'];
  favoriteId: Scalars['Int']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
  supplierId: Scalars['Int']['output'];
};

export type FavoriteToggleInput = {
  customerId: Scalars['Int']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  supplierId: Scalars['Int']['input'];
};

export type FavoriteToggleResult = {
  __typename?: 'FavoriteToggleResult';
  customerId: Scalars['Int']['output'];
  favoriteId?: Maybe<Scalars['Int']['output']>;
  supplierId: Scalars['Int']['output'];
  wasAdded: Scalars['Boolean']['output'];
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

export type MarkMessagesReadInput = {
  conversationId: Scalars['Int']['input'];
  viewerUserId: Scalars['Int']['input'];
};

export type MediaAsset = {
  __typename?: 'MediaAsset';
  altText?: Maybe<Scalars['String']['output']>;
  caption?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  mediaAssetId: Scalars['Int']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
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

export type MessageEvent = {
  __typename?: 'MessageEvent';
  conversationId: Scalars['Int']['output'];
  eventType: Scalars['String']['output'];
  messageId: Scalars['Int']['output'];
  senderUserId: Scalars['Int']['output'];
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
  aiComplete: AiCompletionResult;
  archiveConversation: Conversation;
  cancelBooking: Booking;
  cancelCalendarEvent: CalendarEvent;
  closeRequest: Request;
  completeBooking: Booking;
  completeOnboarding: LoginOutput;
  createAiConversation: AiConversation;
  createCalendarEvent: CalendarEvent;
  createCategory: Category;
  createConversation: Conversation;
  createPost: Post;
  createPricing: Pricing;
  createQuote: Quote;
  createRequest: Request;
  createReview: Review;
  createService: Service;
  createSubscription: PlanSubscription;
  createSupplier: Supplier;
  createUser: User;
  deleteAiConversation: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  deleteReview: Scalars['Boolean']['output'];
  deleteService: Scalars['Boolean']['output'];
  deleteSupplierMedia: Scalars['Boolean']['output'];
  linkAiConversationToRequest: AiConversation;
  markAllNotificationsAsRead: Scalars['Int']['output'];
  markMessagesAsRead: Scalars['Float']['output'];
  markNotificationAsRead: Notification;
  markQuotesViewed: Scalars['Float']['output'];
  mergeGuestAiConversations: Scalars['Float']['output'];
  requestPasswordReset: PasswordResetResult;
  resetPassword: PasswordResetResult;
  reorderSupplierMedia: Scalars['Boolean']['output'];
  restoreConversation: Conversation;
  rollbackLastAiTurn: Scalars['Float']['output'];
  sendAiMessage: SendAiMessageResult;
  sendMessage: Message;
  setSupplierCategories: Scalars['Boolean']['output'];
  setSupplierPromotion: SupplierPromotionResult;
  signup: User;
  socialLogin: LoginOutput;
  toggleFavorite: FavoriteToggleResult;
  updateAiConversation: AiConversation;
  updateAiMessageProviders: AiMessage;
  updateCalendarEvent: CalendarEvent;
  updateCustomer: Customer;
  updatePost: Post;
  updateRequestStatus: Request;
  updateReview: Review;
  updateService: Service;
  updateSupplier: Supplier;
  updateUser: User;
  withdrawQuote: Quote;
};


export type MutationAcceptQuoteArgs = {
  data: QuoteAcceptInput;
};


export type MutationAiCompleteArgs = {
  data: AiCompletionInput;
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


export type MutationCompleteOnboardingArgs = {
  data: CompleteOnboardingInput;
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


export type MutationCreateReviewArgs = {
  data: ReviewCreateInput;
};


export type MutationCreateServiceArgs = {
  data: ServiceCreateInput;
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


export type MutationDeleteReviewArgs = {
  data: ReviewDeleteInput;
};


export type MutationDeleteServiceArgs = {
  data: ServiceDeleteInput;
};


export type MutationDeleteSupplierMediaArgs = {
  data: SupplierMediaDeleteInput;
};


export type MutationLinkAiConversationToRequestArgs = {
  data: AiConversationLinkInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationMarkAllNotificationsAsReadArgs = {
  data: NotificationsMarkAllReadInput;
};


export type MutationMarkMessagesAsReadArgs = {
  data: MarkMessagesReadInput;
};


export type MutationMarkNotificationAsReadArgs = {
  data: NotificationMarkReadInput;
};


export type MutationMarkQuotesViewedArgs = {
  data: QuoteMarkViewedInput;
};


export type MutationMergeGuestAiConversationsArgs = {
  deviceId: Scalars['String']['input'];
};


export type MutationRequestPasswordResetArgs = {
  data: RequestPasswordResetInput;
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInput;
};


export type MutationReorderSupplierMediaArgs = {
  data: SupplierMediaReorderInput;
};


export type MutationRestoreConversationArgs = {
  data: ConversationRestoreInput;
};


export type MutationRollbackLastAiTurnArgs = {
  conversationId: Scalars['String']['input'];
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSendAiMessageArgs = {
  data: AiMessageSendInput;
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSendMessageArgs = {
  data: MessageSendInput;
};


export type MutationSetSupplierCategoriesArgs = {
  data: SupplierCategoriesInput;
};


export type MutationSetSupplierPromotionArgs = {
  data: SetSupplierPromotionInput;
};


export type MutationSignupArgs = {
  data: SignUpInput;
};


export type MutationSocialLoginArgs = {
  data: SocialLoginInput;
};


export type MutationToggleFavoriteArgs = {
  data: FavoriteToggleInput;
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


export type MutationUpdateCustomerArgs = {
  data: CustomerUpdateInput;
};


export type MutationUpdatePostArgs = {
  data: PostUpdateInput;
  where?: InputMaybe<PostWhereInput>;
  whereUnique?: InputMaybe<PostWhereUniqueInput>;
};


export type MutationUpdateRequestStatusArgs = {
  data: RequestUpdateStatusInput;
};


export type MutationUpdateReviewArgs = {
  data: ReviewUpdateInput;
};


export type MutationUpdateServiceArgs = {
  data: ServiceUpdateInput;
};


export type MutationUpdateSupplierArgs = {
  data: SupplierUpdateInput;
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
};


export type MutationWithdrawQuoteArgs = {
  data: QuoteWithdrawInput;
};

export type Notification = {
  __typename?: 'Notification';
  body: Scalars['String']['output'];
  channel: NotificationChannel;
  createdAt: Scalars['DateTime']['output'];
  entityId?: Maybe<Scalars['Int']['output']>;
  entityType?: Maybe<Scalars['String']['output']>;
  notificationId: Scalars['Int']['output'];
  readAt?: Maybe<Scalars['DateTime']['output']>;
  status: NotificationStatus;
  subject?: Maybe<Scalars['String']['output']>;
  template: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

/** How a notification is delivered (in-app, email, etc.) */
export enum NotificationChannel {
  Email = 'EMAIL',
  InApp = 'IN_APP',
  Push = 'PUSH',
  Sms = 'SMS',
  Whatsapp = 'WHATSAPP'
}

export type NotificationMarkReadInput = {
  notificationId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

/** Delivery lifecycle status of a notification */
export enum NotificationStatus {
  Delivered = 'DELIVERED',
  Failed = 'FAILED',
  Queued = 'QUEUED',
  Read = 'READ',
  Sent = 'SENT'
}

export type NotificationsMarkAllReadInput = {
  userId: Scalars['Int']['input'];
};

export type PasswordResetResult = {
  __typename?: 'PasswordResetResult';
  ok: Scalars['Boolean']['output'];
  resetUrl?: Maybe<Scalars['String']['output']>;
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

export type PlanSubscription = {
  __typename?: 'PlanSubscription';
  endDate: Scalars['DateTime']['output'];
  plan?: Maybe<Pricing>;
  planId: Scalars['Float']['output'];
  startDate: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
  subscriptionId: Scalars['Float']['output'];
  user?: Maybe<User>;
  userId: Scalars['Float']['output'];
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

export enum PromotionTier {
  Featured = 'FEATURED',
  None = 'NONE'
}

export type Query = {
  __typename?: 'Query';
  adminStats: AdminStats;
  aiConversation: AiConversation;
  aiConversations: Array<AiConversation>;
  aiMessages: Array<AiMessage>;
  aiUsageBreakdown: Array<AiUsageBreakdownRow>;
  booking: Booking;
  bookingsByCustomer: Array<Booking>;
  bookingsBySupplier: Array<Booking>;
  calendarEvent: CalendarEvent;
  calendarEventsBySupplier: Array<CalendarEvent>;
  categories: Array<Category>;
  category: Category;
  conversation: Conversation;
  conversationsByCustomer: Array<Conversation>;
  conversationsBySupplier: Array<Conversation>;
  customer: Customer;
  favoritesByCustomer: Array<Favorite>;
  login: LoginOutput;
  messagesByConversation: Array<Message>;
  notificationsByUser: Array<Notification>;
  openRequestsForSupplier: Array<Request>;
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
  revenueByDay: Array<RevenueByDayRow>;
  search: Search;
  searchSuppliers: Array<Supplier>;
  servicesBySupplier: Array<Service>;
  subscription: PlanSubscription;
  supplier: Supplier;
  supplierDashboardStats: SupplierDashboardStats;
  suppliers: Array<Supplier>;
  topSuppliers: Array<TopSupplierRow>;
  unreadNotificationCount: Scalars['Int']['output'];
  user: User;
};


export type QueryAdminStatsArgs = {
  adminUserId: Scalars['Int']['input'];
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


export type QueryAiUsageBreakdownArgs = {
  adminUserId: Scalars['Int']['input'];
  daysBack?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryCustomerArgs = {
  where: CustomerWhereInput;
};


export type QueryFavoritesByCustomerArgs = {
  customerId: Scalars['Int']['input'];
};


export type QueryLoginArgs = {
  data: LoginUserInput;
};


export type QueryMessagesByConversationArgs = {
  conversationId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotificationsByUserArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  unreadOnly?: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['Int']['input'];
};


export type QueryOpenRequestsForSupplierArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  supplierId: Scalars['Int']['input'];
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


export type QueryRevenueByDayArgs = {
  adminUserId: Scalars['Int']['input'];
  daysBack?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchArgs = {
  query?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
};


export type QuerySearchSuppliersArgs = {
  data: SupplierSearchInput;
};


export type QueryServicesBySupplierArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
  supplierId: Scalars['Int']['input'];
};


export type QuerySubscriptionArgs = {
  where: SubscriptionWhereInput;
};


export type QuerySupplierArgs = {
  where: SupplierWhereInput;
};


export type QuerySupplierDashboardStatsArgs = {
  supplierId: Scalars['Int']['input'];
};


export type QueryTopSuppliersArgs = {
  adminUserId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUnreadNotificationCountArgs = {
  userId: Scalars['Int']['input'];
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
  offeredSlots?: Maybe<Array<QuoteSlot>>;
  quoteId: Scalars['Float']['output'];
  request?: Maybe<Request>;
  requestId: Scalars['Float']['output'];
  respondedAt?: Maybe<Scalars['DateTime']['output']>;
  selectedSlotIndex?: Maybe<Scalars['Int']['output']>;
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
  slotIndex?: InputMaybe<Scalars['Int']['input']>;
};

export type QuoteCreateInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<QuoteItemInput>>;
  message?: InputMaybe<Scalars['String']['input']>;
  offeredSlots?: InputMaybe<Array<QuoteSlotInput>>;
  requestId: Scalars['Int']['input'];
  supplierId: Scalars['Int']['input'];
  totalPrice: Scalars['Float']['input'];
  validUntil: Scalars['DateTime']['input'];
};

export type QuoteEvent = {
  __typename?: 'QuoteEvent';
  eventType: Scalars['String']['output'];
  quoteId: Scalars['Int']['output'];
  requestId: Scalars['Int']['output'];
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

export type QuoteSlot = {
  __typename?: 'QuoteSlot';
  endsAt: Scalars['DateTime']['output'];
  startsAt: Scalars['DateTime']['output'];
};

export type QuoteSlotInput = {
  endsAt: Scalars['DateTime']['input'];
  startsAt: Scalars['DateTime']['input'];
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

export type RequestEvent = {
  __typename?: 'RequestEvent';
  eventType: Scalars['String']['output'];
  requestId: Scalars['Int']['output'];
};

export type RequestPasswordResetInput = {
  email: Scalars['String']['input'];
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

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type RevenueByDayRow = {
  __typename?: 'RevenueByDayRow';
  bookings: Scalars['Int']['output'];
  day: Scalars['String']['output'];
  platformFee: Scalars['String']['output'];
};

export type Review = {
  __typename?: 'Review';
  bookingId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  customer?: Maybe<Customer>;
  customerId: Scalars['Int']['output'];
  rating: Scalars['Int']['output'];
  ratingCommunication?: Maybe<Scalars['Int']['output']>;
  ratingPunctuality?: Maybe<Scalars['Int']['output']>;
  ratingQuality?: Maybe<Scalars['Int']['output']>;
  ratingValue?: Maybe<Scalars['Int']['output']>;
  reviewId: Scalars['Int']['output'];
  supplierId: Scalars['Int']['output'];
  supplierResponse?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
};

export type ReviewCreateInput = {
  bookingId: Scalars['Int']['input'];
  customerId: Scalars['Int']['input'];
  rating: Scalars['Int']['input'];
  ratingCommunication?: InputMaybe<Scalars['Int']['input']>;
  ratingPunctuality?: InputMaybe<Scalars['Int']['input']>;
  ratingQuality?: InputMaybe<Scalars['Int']['input']>;
  ratingValue?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type ReviewDeleteInput = {
  customerId: Scalars['Int']['input'];
  reviewId: Scalars['Int']['input'];
};

export type ReviewUpdateInput = {
  customerId: Scalars['Int']['input'];
  rating: Scalars['Int']['input'];
  ratingCommunication?: InputMaybe<Scalars['Int']['input']>;
  ratingPunctuality?: InputMaybe<Scalars['Int']['input']>;
  ratingQuality?: InputMaybe<Scalars['Int']['input']>;
  ratingValue?: InputMaybe<Scalars['Int']['input']>;
  reviewId: Scalars['Int']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
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

export type ServiceCreateInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  basePrice: Scalars['String']['input'];
  categoryId: Scalars['Int']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  maxTotalPrice?: InputMaybe<Scalars['String']['input']>;
  maxUnits?: InputMaybe<Scalars['Int']['input']>;
  minTotalPrice?: InputMaybe<Scalars['String']['input']>;
  minUnits?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  pricingModel?: InputMaybe<PricingModel>;
  supplierId: Scalars['Int']['input'];
  unitLabel?: InputMaybe<Scalars['String']['input']>;
};

export type ServiceDeleteInput = {
  serviceId: Scalars['Int']['input'];
  supplierId: Scalars['Int']['input'];
};

export type ServiceUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  basePrice: Scalars['String']['input'];
  categoryId: Scalars['Int']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  maxTotalPrice?: InputMaybe<Scalars['String']['input']>;
  maxUnits?: InputMaybe<Scalars['Int']['input']>;
  minTotalPrice?: InputMaybe<Scalars['String']['input']>;
  minUnits?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  pricingModel?: InputMaybe<PricingModel>;
  serviceId: Scalars['Int']['input'];
  supplierId: Scalars['Int']['input'];
  unitLabel?: InputMaybe<Scalars['String']['input']>;
};

export type SetSupplierPromotionInput = {
  adminUserId: Scalars['Int']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  supplierId: Scalars['Int']['input'];
  tier: PromotionTier;
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

export type SocialLoginInput = {
  provider: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  bookingEventForCustomer: BookingEvent;
  bookingEventForSupplier: BookingEvent;
  messageEventForConversation: MessageEvent;
  notificationCreated: Notification;
  openRequestEventForSupplier: RequestEvent;
  quoteEventForCustomer: QuoteEvent;
  quoteEventForSupplier: QuoteEvent;
  requestEventForCustomer: RequestEvent;
};


export type SubscriptionBookingEventForCustomerArgs = {
  customerId: Scalars['Int']['input'];
};


export type SubscriptionBookingEventForSupplierArgs = {
  supplierId: Scalars['Int']['input'];
};


export type SubscriptionMessageEventForConversationArgs = {
  conversationId: Scalars['Int']['input'];
};


export type SubscriptionNotificationCreatedArgs = {
  userId: Scalars['Int']['input'];
};


export type SubscriptionOpenRequestEventForSupplierArgs = {
  supplierId: Scalars['Int']['input'];
};


export type SubscriptionQuoteEventForCustomerArgs = {
  customerId: Scalars['Int']['input'];
};


export type SubscriptionQuoteEventForSupplierArgs = {
  supplierId: Scalars['Int']['input'];
};


export type SubscriptionRequestEventForCustomerArgs = {
  customerId: Scalars['Int']['input'];
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
  businessEmailAlt?: Maybe<Scalars['String']['output']>;
  businessPhone?: Maybe<Scalars['String']['output']>;
  businessPhoneAlt?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<Array<SupplierCategory>>;
  city?: Maybe<Scalars['String']['output']>;
  companyName: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  maxCapacity?: Maybe<Scalars['Float']['output']>;
  media?: Maybe<Array<MediaAsset>>;
  minCapacity?: Maybe<Scalars['Float']['output']>;
  posts?: Maybe<Array<Post>>;
  premium?: Maybe<Scalars['Boolean']['output']>;
  promotionEndDate?: Maybe<Scalars['DateTime']['output']>;
  promotionStartDate?: Maybe<Scalars['DateTime']['output']>;
  promotionTier: PromotionTier;
  rating?: Maybe<Scalars['String']['output']>;
  responseTimeMinutes?: Maybe<Scalars['Float']['output']>;
  reviewCount?: Maybe<Scalars['Float']['output']>;
  reviewsReceived?: Maybe<Array<Review>>;
  services?: Maybe<Array<Service>>;
  slug?: Maybe<Scalars['String']['output']>;
  supplierId: Scalars['Float']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  verified?: Maybe<Scalars['Boolean']['output']>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
  whatsappNumber?: Maybe<Scalars['String']['output']>;
};

export type SupplierCategoriesInput = {
  categoryIds: Array<Scalars['Int']['input']>;
  primaryCategoryId?: InputMaybe<Scalars['Int']['input']>;
  supplierId: Scalars['Int']['input'];
};

export type SupplierCategory = {
  __typename?: 'SupplierCategory';
  category?: Maybe<Category>;
  categoryId: Scalars['Int']['output'];
  isPrimary: Scalars['Boolean']['output'];
  supplierId: Scalars['Int']['output'];
};

export type SupplierCreateInput = {
  companyName: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['Float']['input']>;
};

export type SupplierDashboardStats = {
  __typename?: 'SupplierDashboardStats';
  activeLeadsCount: Scalars['Int']['output'];
  conversionRate: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  mtdEarnings: Scalars['String']['output'];
  mtdGross: Scalars['String']['output'];
  platformFeeRate: Scalars['Float']['output'];
  responseRate: Scalars['Float']['output'];
  weeklyLeadCounts: Array<Scalars['Int']['output']>;
};

export type SupplierMediaDeleteInput = {
  mediaAssetId: Scalars['Int']['input'];
  supplierId: Scalars['Int']['input'];
};

export type SupplierMediaReorderInput = {
  mediaAssetIds: Array<Scalars['Int']['input']>;
  supplierId: Scalars['Int']['input'];
};

export type SupplierPromotionResult = {
  __typename?: 'SupplierPromotionResult';
  promotionEndDate?: Maybe<Scalars['DateTime']['output']>;
  promotionStartDate?: Maybe<Scalars['DateTime']['output']>;
  promotionTier: PromotionTier;
  supplierId: Scalars['Int']['output'];
};

export type SupplierSearchInput = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  guestCount?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  serviceQuery?: InputMaybe<Scalars['String']['input']>;
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
  maxCapacity?: InputMaybe<Scalars['Int']['input']>;
  minCapacity?: InputMaybe<Scalars['Int']['input']>;
  responseTimeMinutes?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  supplierId: Scalars['Int']['input'];
  tagline?: InputMaybe<Scalars['String']['input']>;
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
  whatsappNumber?: InputMaybe<Scalars['String']['input']>;
};

export type SupplierWhereInput = {
  supplierId?: InputMaybe<Scalars['Int']['input']>;
};

export type TopSupplierRow = {
  __typename?: 'TopSupplierRow';
  bookingCount: Scalars['Int']['output'];
  city?: Maybe<Scalars['String']['output']>;
  companyName: Scalars['String']['output'];
  grossRevenue: Scalars['String']['output'];
  quoteCount: Scalars['Int']['output'];
  rating?: Maybe<Scalars['String']['output']>;
  supplierId: Scalars['Int']['output'];
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
  phone?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  role: Role;
  subscription?: Maybe<Array<PlanSubscription>>;
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

export type UserUpdateInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['Int']['input'];
};

export type UserWhereInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type AdminStatsQueryVariables = Exact<{
  adminUserId: Scalars['Int']['input'];
}>;


export type AdminStatsQuery = { __typename?: 'Query', adminStats: { __typename?: 'AdminStats', totalUsers: number, totalCustomers: number, totalSuppliers: number, totalBookings: number, mtdRevenue: string, allTimeRevenue: string, currency: string } };

export type AdminSuppliersQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminSuppliersQuery = { __typename?: 'Query', suppliers: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string, city?: string | null, rating?: string | null, reviewCount?: number | null, verified?: boolean | null, promotionTier: PromotionTier, promotionStartDate?: any | null, promotionEndDate?: any | null }> };

export type AiUsageBreakdownQueryVariables = Exact<{
  adminUserId: Scalars['Int']['input'];
  daysBack?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AiUsageBreakdownQuery = { __typename?: 'Query', aiUsageBreakdown: Array<{ __typename?: 'AiUsageBreakdownRow', modelName: string, requests: number, inputTokens: number, outputTokens: number, costUsd: string }> };

export type RevenueByDayQueryVariables = Exact<{
  adminUserId: Scalars['Int']['input'];
  daysBack?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RevenueByDayQuery = { __typename?: 'Query', revenueByDay: Array<{ __typename?: 'RevenueByDayRow', day: string, platformFee: string, bookings: number }> };

export type SetSupplierPromotionMutationVariables = Exact<{
  data: SetSupplierPromotionInput;
}>;


export type SetSupplierPromotionMutation = { __typename?: 'Mutation', setSupplierPromotion: { __typename?: 'SupplierPromotionResult', supplierId: number, promotionTier: PromotionTier, promotionStartDate?: any | null, promotionEndDate?: any | null } };

export type TopSuppliersQueryVariables = Exact<{
  adminUserId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TopSuppliersQuery = { __typename?: 'Query', topSuppliers: Array<{ __typename?: 'TopSupplierRow', supplierId: number, companyName: string, city?: string | null, bookingCount: number, quoteCount: number, grossRevenue: string, rating?: string | null }> };

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

export type CompleteOnboardingMutationVariables = Exact<{
  data: CompleteOnboardingInput;
}>;


export type CompleteOnboardingMutation = { __typename?: 'Mutation', completeOnboarding: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, isCustomer?: boolean | null, isSupplier?: boolean | null } } };

export type LoginQueryVariables = Exact<{
  data: LoginUserInput;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, email: string, language: Language, country: string, name: string, phone?: string | null, role: Role, profilePicture?: string | null, isCustomer?: boolean | null, isSupplier?: boolean | null, isAdmin?: boolean | null, subscription?: Array<{ __typename?: 'PlanSubscription', subscriptionId: number, status: string, startDate: any, endDate: any, plan?: { __typename?: 'Pricing', planId: number, planName: string, price: string } | null }> | null, supplier?: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string }> | null, customer?: { __typename?: 'Customer', customerId: number, defaultCity?: string | null } | null } } };

export type RefreshUserQueryVariables = Exact<{
  data: Scalars['String']['input'];
}>;


export type RefreshUserQuery = { __typename?: 'Query', refreshUser: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, email: string, language: Language, country: string, name: string, phone?: string | null, role: Role, profilePicture?: string | null, isCustomer?: boolean | null, isSupplier?: boolean | null, isAdmin?: boolean | null, subscription?: Array<{ __typename?: 'PlanSubscription', subscriptionId: number, status: string, startDate: any, endDate: any, plan?: { __typename?: 'Pricing', planId: number, planName: string, price: string } | null }> | null, supplier?: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string }> | null, customer?: { __typename?: 'Customer', customerId: number, defaultCity?: string | null } | null } } };

export type RequestPasswordResetMutationVariables = Exact<{
  data: RequestPasswordResetInput;
}>;


export type RequestPasswordResetMutation = { __typename?: 'Mutation', requestPasswordReset: { __typename?: 'PasswordResetResult', ok: boolean, resetUrl?: string | null } };

export type ResetPasswordMutationVariables = Exact<{
  data: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'PasswordResetResult', ok: boolean } };

export type SignupMutationVariables = Exact<{
  data: SignUpInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'User', userId: number, email: string, name: string, role: Role, isCustomer?: boolean | null, isSupplier?: boolean | null, customer?: { __typename?: 'Customer', customerId: number } | null, supplier?: Array<{ __typename?: 'Supplier', supplierId: number }> | null } };

export type SocialLoginMutationVariables = Exact<{
  data: SocialLoginInput;
}>;


export type SocialLoginMutation = { __typename?: 'Mutation', socialLogin: { __typename?: 'LoginOutput', access_token: string, expiresAt: any, user: { __typename?: 'User', userId: number, email: string, name: string, isCustomer?: boolean | null, isSupplier?: boolean | null } } };

export type BookingEventForCustomerSubscriptionVariables = Exact<{
  customerId: Scalars['Int']['input'];
}>;


export type BookingEventForCustomerSubscription = { __typename?: 'Subscription', bookingEventForCustomer: { __typename?: 'BookingEvent', eventType: string, bookingId: number } };

export type BookingEventForSupplierSubscriptionVariables = Exact<{
  supplierId: Scalars['Int']['input'];
}>;


export type BookingEventForSupplierSubscription = { __typename?: 'Subscription', bookingEventForSupplier: { __typename?: 'BookingEvent', eventType: string, bookingId: number } };

export type BookingQueryVariables = Exact<{
  where: BookingWhereInput;
}>;


export type BookingQuery = { __typename?: 'Query', booking: { __typename?: 'Booking', bookingId: number, requestId: number, quoteId: number, customerId: number, supplierId: number, serviceDate: any, serviceEndDate?: any | null, location: string, guestCount?: number | null, totalPrice: string, platformFee: string, supplierPayout: string, currency: string, status: BookingStatus, paymentStatus: PaymentStatus, phoneRevealedAt?: any | null, cancellationReason?: string | null, cancelledAt?: any | null, cancelledBy?: string | null, completedAt?: any | null, createdAt: any, updatedAt: any, request?: { __typename?: 'Request', requestId: number, rawQuery: string, serviceDate?: any | null, guestCount?: number | null, city?: string | null } | null, quote?: { __typename?: 'Quote', quoteId: number, totalPrice: string, currency: string, validUntil: any, message?: string | null } | null, customer?: { __typename?: 'Customer', customerId: number, user?: { __typename?: 'User', userId: number, name: string, email: string } | null } | null, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string, city?: string | null, businessPhone?: string | null, whatsappNumber?: string | null } | null, review?: { __typename?: 'Review', reviewId: number, rating: number, text?: string | null, ratingQuality?: number | null, ratingCommunication?: number | null, ratingValue?: number | null, ratingPunctuality?: number | null, createdAt: any } | null } };

export type BookingsByCustomerQueryVariables = Exact<{
  customerId: Scalars['Int']['input'];
  status?: InputMaybe<BookingStatus>;
}>;


export type BookingsByCustomerQuery = { __typename?: 'Query', bookingsByCustomer: Array<{ __typename?: 'Booking', bookingId: number, requestId: number, quoteId: number, supplierId: number, serviceDate: any, location: string, guestCount?: number | null, totalPrice: string, currency: string, status: BookingStatus, paymentStatus: PaymentStatus, createdAt: any, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string } | null, request?: { __typename?: 'Request', requestId: number, rawQuery: string } | null, review?: { __typename?: 'Review', reviewId: number, rating: number } | null }> };

export type BookingsBySupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
  status?: InputMaybe<BookingStatus>;
}>;


export type BookingsBySupplierQuery = { __typename?: 'Query', bookingsBySupplier: Array<{ __typename?: 'Booking', bookingId: number, requestId: number, quoteId: number, customerId: number, serviceDate: any, location: string, guestCount?: number | null, totalPrice: string, supplierPayout: string, currency: string, status: BookingStatus, paymentStatus: PaymentStatus, createdAt: any, customer?: { __typename?: 'Customer', customerId: number, user?: { __typename?: 'User', userId: number, name: string } | null } | null, request?: { __typename?: 'Request', requestId: number, rawQuery: string } | null, review?: { __typename?: 'Review', reviewId: number, rating: number } | null }> };

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

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', categoryId: number, categoryName: string }> };

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

export type MessageEventForConversationSubscriptionVariables = Exact<{
  conversationId: Scalars['Int']['input'];
}>;


export type MessageEventForConversationSubscription = { __typename?: 'Subscription', messageEventForConversation: { __typename?: 'MessageEvent', eventType: string, conversationId: number, messageId: number, senderUserId: number } };

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

export type CustomerQueryVariables = Exact<{
  where: CustomerWhereInput;
}>;


export type CustomerQuery = { __typename?: 'Query', customer: { __typename?: 'Customer', customerId: number, userId: number, defaultCity?: string | null, defaultAddress?: string | null, marketingOptIn: boolean, user?: { __typename?: 'User', userId: number, email: string, name: string, phone?: string | null, country: string } | null } };

export type UpdateCustomerMutationVariables = Exact<{
  data: CustomerUpdateInput;
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', updateCustomer: { __typename?: 'Customer', customerId: number, defaultCity?: string | null, defaultAddress?: string | null, marketingOptIn: boolean } };

export type FavoritesByCustomerQueryVariables = Exact<{
  customerId: Scalars['Int']['input'];
}>;


export type FavoritesByCustomerQuery = { __typename?: 'Query', favoritesByCustomer: Array<{ __typename?: 'Favorite', favoriteId: number, customerId: number, supplierId: number, notes?: string | null, createdAt: any, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string, city?: string | null, rating?: string | null, reviewCount?: number | null, categories?: Array<{ __typename?: 'SupplierCategory', isPrimary: boolean, category?: { __typename?: 'Category', categoryId: number, categoryName: string } | null }> | null } | null }> };

export type ToggleFavoriteMutationVariables = Exact<{
  data: FavoriteToggleInput;
}>;


export type ToggleFavoriteMutation = { __typename?: 'Mutation', toggleFavorite: { __typename?: 'FavoriteToggleResult', favoriteId?: number | null, customerId: number, supplierId: number, wasAdded: boolean } };

export type MarkAllNotificationsAsReadMutationVariables = Exact<{
  data: NotificationsMarkAllReadInput;
}>;


export type MarkAllNotificationsAsReadMutation = { __typename?: 'Mutation', markAllNotificationsAsRead: number };

export type MarkNotificationAsReadMutationVariables = Exact<{
  data: NotificationMarkReadInput;
}>;


export type MarkNotificationAsReadMutation = { __typename?: 'Mutation', markNotificationAsRead: { __typename?: 'Notification', notificationId: number, readAt?: any | null, status: NotificationStatus } };

export type NotificationCreatedSubscriptionVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type NotificationCreatedSubscription = { __typename?: 'Subscription', notificationCreated: { __typename?: 'Notification', notificationId: number, userId: number, channel: NotificationChannel, template: string, subject?: string | null, body: string, entityType?: string | null, entityId?: number | null, status: NotificationStatus, readAt?: any | null, createdAt: any } };

export type NotificationsByUserQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
  unreadOnly?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type NotificationsByUserQuery = { __typename?: 'Query', notificationsByUser: Array<{ __typename?: 'Notification', notificationId: number, userId: number, channel: NotificationChannel, template: string, subject?: string | null, body: string, entityType?: string | null, entityId?: number | null, status: NotificationStatus, readAt?: any | null, createdAt: any }> };

export type UnreadNotificationCountQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type UnreadNotificationCountQuery = { __typename?: 'Query', unreadNotificationCount: number };

export type AcceptQuoteMutationVariables = Exact<{
  data: QuoteAcceptInput;
}>;


export type AcceptQuoteMutation = { __typename?: 'Mutation', acceptQuote: { __typename?: 'Booking', bookingId: number, requestId: number, quoteId: number, customerId: number, supplierId: number, serviceDate: any, location: string, guestCount?: number | null, totalPrice: string, platformFee: string, supplierPayout: string, currency: string, status: BookingStatus, paymentStatus: PaymentStatus, createdAt: any } };

export type CreateQuoteMutationVariables = Exact<{
  data: QuoteCreateInput;
}>;


export type CreateQuoteMutation = { __typename?: 'Mutation', createQuote: { __typename?: 'Quote', quoteId: number, requestId: number, supplierId: number, totalPrice: string, currency: string, message?: string | null, validUntil: any, status: QuoteStatus, createdAt: any, items?: Array<{ __typename?: 'QuoteItem', quoteItemId: number, description: string, quantity: string, unitPrice: string, total: string }> | null, offeredSlots?: Array<{ __typename?: 'QuoteSlot', startsAt: any, endsAt: any }> | null } };

export type MarkQuotesViewedMutationVariables = Exact<{
  data: QuoteMarkViewedInput;
}>;


export type MarkQuotesViewedMutation = { __typename?: 'Mutation', markQuotesViewed: number };

export type QuoteEventForCustomerSubscriptionVariables = Exact<{
  customerId: Scalars['Int']['input'];
}>;


export type QuoteEventForCustomerSubscription = { __typename?: 'Subscription', quoteEventForCustomer: { __typename?: 'QuoteEvent', eventType: string, quoteId: number, requestId: number } };

export type QuoteEventForSupplierSubscriptionVariables = Exact<{
  supplierId: Scalars['Int']['input'];
}>;


export type QuoteEventForSupplierSubscription = { __typename?: 'Subscription', quoteEventForSupplier: { __typename?: 'QuoteEvent', eventType: string, quoteId: number, requestId: number } };

export type QuoteQueryVariables = Exact<{
  where: QuoteWhereInput;
}>;


export type QuoteQuery = { __typename?: 'Query', quote: { __typename?: 'Quote', quoteId: number, requestId: number, supplierId: number, totalPrice: string, currency: string, message?: string | null, validUntil: any, status: QuoteStatus, viewedAt?: any | null, respondedAt?: any | null, createdAt: any, updatedAt: any, items?: Array<{ __typename?: 'QuoteItem', quoteItemId: number, serviceId?: number | null, description: string, quantity: string, unitPrice: string, total: string }> | null } };

export type QuotesByRequestQueryVariables = Exact<{
  requestId: Scalars['Int']['input'];
  status?: InputMaybe<QuoteStatus>;
}>;


export type QuotesByRequestQuery = { __typename?: 'Query', quotesByRequest: Array<{ __typename?: 'Quote', quoteId: number, supplierId: number, totalPrice: string, currency: string, message?: string | null, validUntil: any, status: QuoteStatus, createdAt: any, offeredSlots?: Array<{ __typename?: 'QuoteSlot', startsAt: any, endsAt: any }> | null, supplier?: { __typename?: 'Supplier', supplierId: number, companyName: string, city?: string | null, rating?: string | null, reviewCount?: number | null } | null }> };

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

export type OpenRequestEventForSupplierSubscriptionVariables = Exact<{
  supplierId: Scalars['Int']['input'];
}>;


export type OpenRequestEventForSupplierSubscription = { __typename?: 'Subscription', openRequestEventForSupplier: { __typename?: 'RequestEvent', eventType: string, requestId: number } };

export type OpenRequestsForSupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type OpenRequestsForSupplierQuery = { __typename?: 'Query', openRequestsForSupplier: Array<{ __typename?: 'Request', requestId: number, customerId: number, rawQuery: string, categoryId?: number | null, city?: string | null, serviceDate?: any | null, guestCount?: number | null, budgetMin?: string | null, budgetMax?: string | null, status: RequestStatus, createdAt: any, customer?: { __typename?: 'Customer', customerId: number, user?: { __typename?: 'User', userId: number, name: string } | null } | null }> };

export type RequestEventForCustomerSubscriptionVariables = Exact<{
  customerId: Scalars['Int']['input'];
}>;


export type RequestEventForCustomerSubscription = { __typename?: 'Subscription', requestEventForCustomer: { __typename?: 'RequestEvent', eventType: string, requestId: number } };

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

export type CreateReviewMutationVariables = Exact<{
  data: ReviewCreateInput;
}>;


export type CreateReviewMutation = { __typename?: 'Mutation', createReview: { __typename?: 'Review', reviewId: number, bookingId: number, customerId: number, supplierId: number, rating: number, text?: string | null, ratingQuality?: number | null, ratingCommunication?: number | null, ratingValue?: number | null, ratingPunctuality?: number | null, createdAt: any } };

export type DeleteReviewMutationVariables = Exact<{
  data: ReviewDeleteInput;
}>;


export type DeleteReviewMutation = { __typename?: 'Mutation', deleteReview: boolean };

export type UpdateReviewMutationVariables = Exact<{
  data: ReviewUpdateInput;
}>;


export type UpdateReviewMutation = { __typename?: 'Mutation', updateReview: { __typename?: 'Review', reviewId: number, bookingId: number, rating: number, text?: string | null, ratingQuality?: number | null, ratingCommunication?: number | null, ratingValue?: number | null, ratingPunctuality?: number | null, createdAt: any } };

export type CreateServiceMutationVariables = Exact<{
  data: ServiceCreateInput;
}>;


export type CreateServiceMutation = { __typename?: 'Mutation', createService: { __typename?: 'Service', serviceId: number, supplierId: number, categoryId: number, name: string, description: string, pricingModel: PricingModel, basePrice: string, currency: string, minTotalPrice?: string | null, maxTotalPrice?: string | null, minUnits?: number | null, maxUnits?: number | null, unitLabel?: string | null, active: boolean } };

export type DeleteServiceMutationVariables = Exact<{
  data: ServiceDeleteInput;
}>;


export type DeleteServiceMutation = { __typename?: 'Mutation', deleteService: boolean };

export type ServicesBySupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ServicesBySupplierQuery = { __typename?: 'Query', servicesBySupplier: Array<{ __typename?: 'Service', serviceId: number, supplierId: number, categoryId: number, name: string, description: string, pricingModel: PricingModel, basePrice: string, currency: string, minTotalPrice?: string | null, maxTotalPrice?: string | null, minUnits?: number | null, maxUnits?: number | null, unitLabel?: string | null, active: boolean }> };

export type UpdateServiceMutationVariables = Exact<{
  data: ServiceUpdateInput;
}>;


export type UpdateServiceMutation = { __typename?: 'Mutation', updateService: { __typename?: 'Service', serviceId: number, supplierId: number, categoryId: number, name: string, description: string, pricingModel: PricingModel, basePrice: string, currency: string, minTotalPrice?: string | null, maxTotalPrice?: string | null, minUnits?: number | null, maxUnits?: number | null, unitLabel?: string | null, active: boolean } };

export type DeleteSupplierMediaMutationVariables = Exact<{
  data: SupplierMediaDeleteInput;
}>;


export type DeleteSupplierMediaMutation = { __typename?: 'Mutation', deleteSupplierMedia: boolean };

export type ReorderSupplierMediaMutationVariables = Exact<{
  data: SupplierMediaReorderInput;
}>;


export type ReorderSupplierMediaMutation = { __typename?: 'Mutation', reorderSupplierMedia: boolean };

export type SearchSuppliersQueryVariables = Exact<{
  data: SupplierSearchInput;
}>;


export type SearchSuppliersQuery = { __typename?: 'Query', searchSuppliers: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string, slug?: string | null, tagline?: string | null, description?: string | null, city?: string | null, rating?: string | null, reviewCount?: number | null, responseTimeMinutes?: number | null, minCapacity?: number | null, maxCapacity?: number | null, verified?: boolean | null, premium?: boolean | null, promotionTier: PromotionTier, promotionStartDate?: any | null, promotionEndDate?: any | null, businessPhone?: string | null, businessEmail?: string | null, businessPhoneAlt?: string | null, businessEmailAlt?: string | null, websiteUrl?: string | null, services?: Array<{ __typename?: 'Service', serviceId: number, name: string, description: string, basePrice: string, currency: string, pricingModel: PricingModel }> | null }> };

export type SetSupplierCategoriesMutationVariables = Exact<{
  data: SupplierCategoriesInput;
}>;


export type SetSupplierCategoriesMutation = { __typename?: 'Mutation', setSupplierCategories: boolean };

export type SupplierDashboardStatsQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
}>;


export type SupplierDashboardStatsQuery = { __typename?: 'Query', supplierDashboardStats: { __typename?: 'SupplierDashboardStats', responseRate: number, conversionRate: number, activeLeadsCount: number, mtdEarnings: string, mtdGross: string, currency: string, platformFeeRate: number, weeklyLeadCounts: Array<number> } };

export type SupplierQueryVariables = Exact<{
  where: SupplierWhereInput;
}>;


export type SupplierQuery = { __typename?: 'Query', supplier: { __typename?: 'Supplier', supplierId: number, companyName: string, slug?: string | null, tagline?: string | null, description?: string | null, businessPhone?: string | null, businessEmail?: string | null, businessPhoneAlt?: string | null, businessEmailAlt?: string | null, websiteUrl?: string | null, city?: string | null, rating?: string | null, reviewCount?: number | null, responseTimeMinutes?: number | null, minCapacity?: number | null, maxCapacity?: number | null, verified?: boolean | null, premium?: boolean | null, promotionTier: PromotionTier, promotionStartDate?: any | null, promotionEndDate?: any | null, media?: Array<{ __typename?: 'MediaAsset', mediaAssetId: number, url: string, thumbnailUrl?: string | null, altText?: string | null, displayOrder: number }> | null, services?: Array<{ __typename?: 'Service', serviceId: number, name: string, description: string, pricingModel: PricingModel, basePrice: string, currency: string }> | null, categories?: Array<{ __typename?: 'SupplierCategory', categoryId: number, isPrimary: boolean, category?: { __typename?: 'Category', categoryId: number, categoryName: string } | null }> | null, reviewsReceived?: Array<{ __typename?: 'Review', reviewId: number, rating: number, text?: string | null, ratingQuality?: number | null, ratingCommunication?: number | null, ratingValue?: number | null, ratingPunctuality?: number | null, supplierResponse?: string | null, createdAt: any, customer?: { __typename?: 'Customer', customerId: number, user?: { __typename?: 'User', userId: number, name: string } | null } | null }> | null } };

export type SuppliersQueryVariables = Exact<{ [key: string]: never; }>;


export type SuppliersQuery = { __typename?: 'Query', suppliers: Array<{ __typename?: 'Supplier', supplierId: number, companyName: string, city?: string | null, rating?: string | null, reviewCount?: number | null, verified?: boolean | null, promotionTier: PromotionTier, promotionStartDate?: any | null, promotionEndDate?: any | null, categories?: Array<{ __typename?: 'SupplierCategory', isPrimary: boolean, category?: { __typename?: 'Category', categoryId: number, categoryName: string } | null }> | null }> };

export type UpdateSupplierMutationVariables = Exact<{
  data: SupplierUpdateInput;
}>;


export type UpdateSupplierMutation = { __typename?: 'Mutation', updateSupplier: { __typename?: 'Supplier', supplierId: number, companyName: string, slug?: string | null, tagline?: string | null, description?: string | null, businessPhone?: string | null, businessEmail?: string | null, businessPhoneAlt?: string | null, businessEmailAlt?: string | null, websiteUrl?: string | null, city?: string | null, minCapacity?: number | null, maxCapacity?: number | null, responseTimeMinutes?: number | null } };

export type UpdateUserMutationVariables = Exact<{
  data: UserUpdateInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', userId: number, name: string, phone?: string | null, country: string } };


export const AdminStatsDocument = gql`
    query adminStats($adminUserId: Int!) {
  adminStats(adminUserId: $adminUserId) {
    totalUsers
    totalCustomers
    totalSuppliers
    totalBookings
    mtdRevenue
    allTimeRevenue
    currency
  }
}
    `;

/**
 * __useAdminStatsQuery__
 *
 * To run a query within a React component, call `useAdminStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminStatsQuery({
 *   variables: {
 *      adminUserId: // value for 'adminUserId'
 *   },
 * });
 */
export function useAdminStatsQuery(baseOptions: Apollo.QueryHookOptions<AdminStatsQuery, AdminStatsQueryVariables> & ({ variables: AdminStatsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminStatsQuery, AdminStatsQueryVariables>(AdminStatsDocument, options);
      }
export function useAdminStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminStatsQuery, AdminStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminStatsQuery, AdminStatsQueryVariables>(AdminStatsDocument, options);
        }
// @ts-ignore
export function useAdminStatsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminStatsQuery, AdminStatsQueryVariables>): Apollo.UseSuspenseQueryResult<AdminStatsQuery, AdminStatsQueryVariables>;
export function useAdminStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminStatsQuery, AdminStatsQueryVariables>): Apollo.UseSuspenseQueryResult<AdminStatsQuery | undefined, AdminStatsQueryVariables>;
export function useAdminStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminStatsQuery, AdminStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminStatsQuery, AdminStatsQueryVariables>(AdminStatsDocument, options);
        }
export type AdminStatsQueryHookResult = ReturnType<typeof useAdminStatsQuery>;
export type AdminStatsLazyQueryHookResult = ReturnType<typeof useAdminStatsLazyQuery>;
export type AdminStatsSuspenseQueryHookResult = ReturnType<typeof useAdminStatsSuspenseQuery>;
export type AdminStatsQueryResult = Apollo.QueryResult<AdminStatsQuery, AdminStatsQueryVariables>;
export const AdminSuppliersDocument = gql`
    query adminSuppliers {
  suppliers {
    supplierId
    companyName
    city
    rating
    reviewCount
    verified
    promotionTier
    promotionStartDate
    promotionEndDate
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
export const AiUsageBreakdownDocument = gql`
    query aiUsageBreakdown($adminUserId: Int!, $daysBack: Int) {
  aiUsageBreakdown(adminUserId: $adminUserId, daysBack: $daysBack) {
    modelName
    requests
    inputTokens
    outputTokens
    costUsd
  }
}
    `;

/**
 * __useAiUsageBreakdownQuery__
 *
 * To run a query within a React component, call `useAiUsageBreakdownQuery` and pass it any options that fit your needs.
 * When your component renders, `useAiUsageBreakdownQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAiUsageBreakdownQuery({
 *   variables: {
 *      adminUserId: // value for 'adminUserId'
 *      daysBack: // value for 'daysBack'
 *   },
 * });
 */
export function useAiUsageBreakdownQuery(baseOptions: Apollo.QueryHookOptions<AiUsageBreakdownQuery, AiUsageBreakdownQueryVariables> & ({ variables: AiUsageBreakdownQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AiUsageBreakdownQuery, AiUsageBreakdownQueryVariables>(AiUsageBreakdownDocument, options);
      }
export function useAiUsageBreakdownLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AiUsageBreakdownQuery, AiUsageBreakdownQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AiUsageBreakdownQuery, AiUsageBreakdownQueryVariables>(AiUsageBreakdownDocument, options);
        }
// @ts-ignore
export function useAiUsageBreakdownSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AiUsageBreakdownQuery, AiUsageBreakdownQueryVariables>): Apollo.UseSuspenseQueryResult<AiUsageBreakdownQuery, AiUsageBreakdownQueryVariables>;
export function useAiUsageBreakdownSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AiUsageBreakdownQuery, AiUsageBreakdownQueryVariables>): Apollo.UseSuspenseQueryResult<AiUsageBreakdownQuery | undefined, AiUsageBreakdownQueryVariables>;
export function useAiUsageBreakdownSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AiUsageBreakdownQuery, AiUsageBreakdownQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AiUsageBreakdownQuery, AiUsageBreakdownQueryVariables>(AiUsageBreakdownDocument, options);
        }
export type AiUsageBreakdownQueryHookResult = ReturnType<typeof useAiUsageBreakdownQuery>;
export type AiUsageBreakdownLazyQueryHookResult = ReturnType<typeof useAiUsageBreakdownLazyQuery>;
export type AiUsageBreakdownSuspenseQueryHookResult = ReturnType<typeof useAiUsageBreakdownSuspenseQuery>;
export type AiUsageBreakdownQueryResult = Apollo.QueryResult<AiUsageBreakdownQuery, AiUsageBreakdownQueryVariables>;
export const RevenueByDayDocument = gql`
    query revenueByDay($adminUserId: Int!, $daysBack: Int) {
  revenueByDay(adminUserId: $adminUserId, daysBack: $daysBack) {
    day
    platformFee
    bookings
  }
}
    `;

/**
 * __useRevenueByDayQuery__
 *
 * To run a query within a React component, call `useRevenueByDayQuery` and pass it any options that fit your needs.
 * When your component renders, `useRevenueByDayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRevenueByDayQuery({
 *   variables: {
 *      adminUserId: // value for 'adminUserId'
 *      daysBack: // value for 'daysBack'
 *   },
 * });
 */
export function useRevenueByDayQuery(baseOptions: Apollo.QueryHookOptions<RevenueByDayQuery, RevenueByDayQueryVariables> & ({ variables: RevenueByDayQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RevenueByDayQuery, RevenueByDayQueryVariables>(RevenueByDayDocument, options);
      }
export function useRevenueByDayLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RevenueByDayQuery, RevenueByDayQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RevenueByDayQuery, RevenueByDayQueryVariables>(RevenueByDayDocument, options);
        }
// @ts-ignore
export function useRevenueByDaySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RevenueByDayQuery, RevenueByDayQueryVariables>): Apollo.UseSuspenseQueryResult<RevenueByDayQuery, RevenueByDayQueryVariables>;
export function useRevenueByDaySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RevenueByDayQuery, RevenueByDayQueryVariables>): Apollo.UseSuspenseQueryResult<RevenueByDayQuery | undefined, RevenueByDayQueryVariables>;
export function useRevenueByDaySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RevenueByDayQuery, RevenueByDayQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RevenueByDayQuery, RevenueByDayQueryVariables>(RevenueByDayDocument, options);
        }
export type RevenueByDayQueryHookResult = ReturnType<typeof useRevenueByDayQuery>;
export type RevenueByDayLazyQueryHookResult = ReturnType<typeof useRevenueByDayLazyQuery>;
export type RevenueByDaySuspenseQueryHookResult = ReturnType<typeof useRevenueByDaySuspenseQuery>;
export type RevenueByDayQueryResult = Apollo.QueryResult<RevenueByDayQuery, RevenueByDayQueryVariables>;
export const SetSupplierPromotionDocument = gql`
    mutation setSupplierPromotion($data: SetSupplierPromotionInput!) {
  setSupplierPromotion(data: $data) {
    supplierId
    promotionTier
    promotionStartDate
    promotionEndDate
  }
}
    `;
export type SetSupplierPromotionMutationFn = Apollo.MutationFunction<SetSupplierPromotionMutation, SetSupplierPromotionMutationVariables>;

/**
 * __useSetSupplierPromotionMutation__
 *
 * To run a mutation, you first call `useSetSupplierPromotionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSupplierPromotionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSupplierPromotionMutation, { data, loading, error }] = useSetSupplierPromotionMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSetSupplierPromotionMutation(baseOptions?: Apollo.MutationHookOptions<SetSupplierPromotionMutation, SetSupplierPromotionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetSupplierPromotionMutation, SetSupplierPromotionMutationVariables>(SetSupplierPromotionDocument, options);
      }
export type SetSupplierPromotionMutationHookResult = ReturnType<typeof useSetSupplierPromotionMutation>;
export type SetSupplierPromotionMutationResult = Apollo.MutationResult<SetSupplierPromotionMutation>;
export type SetSupplierPromotionMutationOptions = Apollo.BaseMutationOptions<SetSupplierPromotionMutation, SetSupplierPromotionMutationVariables>;
export const TopSuppliersDocument = gql`
    query topSuppliers($adminUserId: Int!, $limit: Int) {
  topSuppliers(adminUserId: $adminUserId, limit: $limit) {
    supplierId
    companyName
    city
    bookingCount
    quoteCount
    grossRevenue
    rating
  }
}
    `;

/**
 * __useTopSuppliersQuery__
 *
 * To run a query within a React component, call `useTopSuppliersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopSuppliersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopSuppliersQuery({
 *   variables: {
 *      adminUserId: // value for 'adminUserId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useTopSuppliersQuery(baseOptions: Apollo.QueryHookOptions<TopSuppliersQuery, TopSuppliersQueryVariables> & ({ variables: TopSuppliersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopSuppliersQuery, TopSuppliersQueryVariables>(TopSuppliersDocument, options);
      }
export function useTopSuppliersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopSuppliersQuery, TopSuppliersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopSuppliersQuery, TopSuppliersQueryVariables>(TopSuppliersDocument, options);
        }
// @ts-ignore
export function useTopSuppliersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TopSuppliersQuery, TopSuppliersQueryVariables>): Apollo.UseSuspenseQueryResult<TopSuppliersQuery, TopSuppliersQueryVariables>;
export function useTopSuppliersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TopSuppliersQuery, TopSuppliersQueryVariables>): Apollo.UseSuspenseQueryResult<TopSuppliersQuery | undefined, TopSuppliersQueryVariables>;
export function useTopSuppliersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TopSuppliersQuery, TopSuppliersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TopSuppliersQuery, TopSuppliersQueryVariables>(TopSuppliersDocument, options);
        }
export type TopSuppliersQueryHookResult = ReturnType<typeof useTopSuppliersQuery>;
export type TopSuppliersLazyQueryHookResult = ReturnType<typeof useTopSuppliersLazyQuery>;
export type TopSuppliersSuspenseQueryHookResult = ReturnType<typeof useTopSuppliersSuspenseQuery>;
export type TopSuppliersQueryResult = Apollo.QueryResult<TopSuppliersQuery, TopSuppliersQueryVariables>;
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
export const CompleteOnboardingDocument = gql`
    mutation completeOnboarding($data: CompleteOnboardingInput!) {
  completeOnboarding(data: $data) {
    access_token
    expiresAt
    user {
      userId
      isCustomer
      isSupplier
    }
  }
}
    `;
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
export const SocialLoginDocument = gql`
    mutation socialLogin($data: SocialLoginInput!) {
  socialLogin(data: $data) {
    access_token
    expiresAt
    user {
      userId
      email
      name
      isCustomer
      isSupplier
    }
  }
}
    `;
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
export const BookingEventForCustomerDocument = gql`
    subscription bookingEventForCustomer($customerId: Int!) {
  bookingEventForCustomer(customerId: $customerId) {
    eventType
    bookingId
  }
}
    `;

/**
 * __useBookingEventForCustomerSubscription__
 *
 * To run a query within a React component, call `useBookingEventForCustomerSubscription` and pass it any options that fit your needs.
 * When your component renders, `useBookingEventForCustomerSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBookingEventForCustomerSubscription({
 *   variables: {
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useBookingEventForCustomerSubscription(baseOptions: Apollo.SubscriptionHookOptions<BookingEventForCustomerSubscription, BookingEventForCustomerSubscriptionVariables> & ({ variables: BookingEventForCustomerSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<BookingEventForCustomerSubscription, BookingEventForCustomerSubscriptionVariables>(BookingEventForCustomerDocument, options);
      }
export type BookingEventForCustomerSubscriptionHookResult = ReturnType<typeof useBookingEventForCustomerSubscription>;
export type BookingEventForCustomerSubscriptionResult = Apollo.SubscriptionResult<BookingEventForCustomerSubscription>;
export const BookingEventForSupplierDocument = gql`
    subscription bookingEventForSupplier($supplierId: Int!) {
  bookingEventForSupplier(supplierId: $supplierId) {
    eventType
    bookingId
  }
}
    `;

/**
 * __useBookingEventForSupplierSubscription__
 *
 * To run a query within a React component, call `useBookingEventForSupplierSubscription` and pass it any options that fit your needs.
 * When your component renders, `useBookingEventForSupplierSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBookingEventForSupplierSubscription({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *   },
 * });
 */
export function useBookingEventForSupplierSubscription(baseOptions: Apollo.SubscriptionHookOptions<BookingEventForSupplierSubscription, BookingEventForSupplierSubscriptionVariables> & ({ variables: BookingEventForSupplierSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<BookingEventForSupplierSubscription, BookingEventForSupplierSubscriptionVariables>(BookingEventForSupplierDocument, options);
      }
export type BookingEventForSupplierSubscriptionHookResult = ReturnType<typeof useBookingEventForSupplierSubscription>;
export type BookingEventForSupplierSubscriptionResult = Apollo.SubscriptionResult<BookingEventForSupplierSubscription>;
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
    request {
      requestId
      rawQuery
      serviceDate
      guestCount
      city
    }
    quote {
      quoteId
      totalPrice
      currency
      validUntil
      message
    }
    customer {
      customerId
      user {
        userId
        name
        email
      }
    }
    supplier {
      supplierId
      companyName
      city
      businessPhone
      whatsappNumber
    }
    review {
      reviewId
      rating
      text
      ratingQuality
      ratingCommunication
      ratingValue
      ratingPunctuality
      createdAt
    }
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
    review {
      reviewId
      rating
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
    review {
      reviewId
      rating
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
export const CategoriesDocument = gql`
    query categories {
  categories {
    categoryId
    categoryName
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
export const MessageEventForConversationDocument = gql`
    subscription messageEventForConversation($conversationId: Int!) {
  messageEventForConversation(conversationId: $conversationId) {
    eventType
    conversationId
    messageId
    senderUserId
  }
}
    `;

/**
 * __useMessageEventForConversationSubscription__
 *
 * To run a query within a React component, call `useMessageEventForConversationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageEventForConversationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageEventForConversationSubscription({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useMessageEventForConversationSubscription(baseOptions: Apollo.SubscriptionHookOptions<MessageEventForConversationSubscription, MessageEventForConversationSubscriptionVariables> & ({ variables: MessageEventForConversationSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageEventForConversationSubscription, MessageEventForConversationSubscriptionVariables>(MessageEventForConversationDocument, options);
      }
export type MessageEventForConversationSubscriptionHookResult = ReturnType<typeof useMessageEventForConversationSubscription>;
export type MessageEventForConversationSubscriptionResult = Apollo.SubscriptionResult<MessageEventForConversationSubscription>;
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
export const CustomerDocument = gql`
    query customer($where: CustomerWhereInput!) {
  customer(where: $where) {
    customerId
    userId
    defaultCity
    defaultAddress
    marketingOptIn
    user {
      userId
      email
      name
      phone
      country
    }
  }
}
    `;

/**
 * __useCustomerQuery__
 *
 * To run a query within a React component, call `useCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useCustomerQuery(baseOptions: Apollo.QueryHookOptions<CustomerQuery, CustomerQueryVariables> & ({ variables: CustomerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomerQuery, CustomerQueryVariables>(CustomerDocument, options);
      }
export function useCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomerQuery, CustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomerQuery, CustomerQueryVariables>(CustomerDocument, options);
        }
// @ts-ignore
export function useCustomerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CustomerQuery, CustomerQueryVariables>): Apollo.UseSuspenseQueryResult<CustomerQuery, CustomerQueryVariables>;
export function useCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CustomerQuery, CustomerQueryVariables>): Apollo.UseSuspenseQueryResult<CustomerQuery | undefined, CustomerQueryVariables>;
export function useCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CustomerQuery, CustomerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CustomerQuery, CustomerQueryVariables>(CustomerDocument, options);
        }
export type CustomerQueryHookResult = ReturnType<typeof useCustomerQuery>;
export type CustomerLazyQueryHookResult = ReturnType<typeof useCustomerLazyQuery>;
export type CustomerSuspenseQueryHookResult = ReturnType<typeof useCustomerSuspenseQuery>;
export type CustomerQueryResult = Apollo.QueryResult<CustomerQuery, CustomerQueryVariables>;
export const UpdateCustomerDocument = gql`
    mutation updateCustomer($data: CustomerUpdateInput!) {
  updateCustomer(data: $data) {
    customerId
    defaultCity
    defaultAddress
    marketingOptIn
  }
}
    `;
export type UpdateCustomerMutationFn = Apollo.MutationFunction<UpdateCustomerMutation, UpdateCustomerMutationVariables>;

/**
 * __useUpdateCustomerMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerMutation, { data, loading, error }] = useUpdateCustomerMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomerMutation, UpdateCustomerMutationVariables>(UpdateCustomerDocument, options);
      }
export type UpdateCustomerMutationHookResult = ReturnType<typeof useUpdateCustomerMutation>;
export type UpdateCustomerMutationResult = Apollo.MutationResult<UpdateCustomerMutation>;
export type UpdateCustomerMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const FavoritesByCustomerDocument = gql`
    query favoritesByCustomer($customerId: Int!) {
  favoritesByCustomer(customerId: $customerId) {
    favoriteId
    customerId
    supplierId
    notes
    createdAt
    supplier {
      supplierId
      companyName
      city
      rating
      reviewCount
      categories {
        isPrimary
        category {
          categoryId
          categoryName
        }
      }
    }
  }
}
    `;

/**
 * __useFavoritesByCustomerQuery__
 *
 * To run a query within a React component, call `useFavoritesByCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useFavoritesByCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFavoritesByCustomerQuery({
 *   variables: {
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useFavoritesByCustomerQuery(baseOptions: Apollo.QueryHookOptions<FavoritesByCustomerQuery, FavoritesByCustomerQueryVariables> & ({ variables: FavoritesByCustomerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FavoritesByCustomerQuery, FavoritesByCustomerQueryVariables>(FavoritesByCustomerDocument, options);
      }
export function useFavoritesByCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FavoritesByCustomerQuery, FavoritesByCustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FavoritesByCustomerQuery, FavoritesByCustomerQueryVariables>(FavoritesByCustomerDocument, options);
        }
// @ts-ignore
export function useFavoritesByCustomerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FavoritesByCustomerQuery, FavoritesByCustomerQueryVariables>): Apollo.UseSuspenseQueryResult<FavoritesByCustomerQuery, FavoritesByCustomerQueryVariables>;
export function useFavoritesByCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FavoritesByCustomerQuery, FavoritesByCustomerQueryVariables>): Apollo.UseSuspenseQueryResult<FavoritesByCustomerQuery | undefined, FavoritesByCustomerQueryVariables>;
export function useFavoritesByCustomerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FavoritesByCustomerQuery, FavoritesByCustomerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FavoritesByCustomerQuery, FavoritesByCustomerQueryVariables>(FavoritesByCustomerDocument, options);
        }
export type FavoritesByCustomerQueryHookResult = ReturnType<typeof useFavoritesByCustomerQuery>;
export type FavoritesByCustomerLazyQueryHookResult = ReturnType<typeof useFavoritesByCustomerLazyQuery>;
export type FavoritesByCustomerSuspenseQueryHookResult = ReturnType<typeof useFavoritesByCustomerSuspenseQuery>;
export type FavoritesByCustomerQueryResult = Apollo.QueryResult<FavoritesByCustomerQuery, FavoritesByCustomerQueryVariables>;
export const ToggleFavoriteDocument = gql`
    mutation toggleFavorite($data: FavoriteToggleInput!) {
  toggleFavorite(data: $data) {
    favoriteId
    customerId
    supplierId
    wasAdded
  }
}
    `;
export type ToggleFavoriteMutationFn = Apollo.MutationFunction<ToggleFavoriteMutation, ToggleFavoriteMutationVariables>;

/**
 * __useToggleFavoriteMutation__
 *
 * To run a mutation, you first call `useToggleFavoriteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleFavoriteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleFavoriteMutation, { data, loading, error }] = useToggleFavoriteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useToggleFavoriteMutation(baseOptions?: Apollo.MutationHookOptions<ToggleFavoriteMutation, ToggleFavoriteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleFavoriteMutation, ToggleFavoriteMutationVariables>(ToggleFavoriteDocument, options);
      }
export type ToggleFavoriteMutationHookResult = ReturnType<typeof useToggleFavoriteMutation>;
export type ToggleFavoriteMutationResult = Apollo.MutationResult<ToggleFavoriteMutation>;
export type ToggleFavoriteMutationOptions = Apollo.BaseMutationOptions<ToggleFavoriteMutation, ToggleFavoriteMutationVariables>;
export const MarkAllNotificationsAsReadDocument = gql`
    mutation markAllNotificationsAsRead($data: NotificationsMarkAllReadInput!) {
  markAllNotificationsAsRead(data: $data)
}
    `;
export type MarkAllNotificationsAsReadMutationFn = Apollo.MutationFunction<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>;

/**
 * __useMarkAllNotificationsAsReadMutation__
 *
 * To run a mutation, you first call `useMarkAllNotificationsAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAllNotificationsAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAllNotificationsAsReadMutation, { data, loading, error }] = useMarkAllNotificationsAsReadMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useMarkAllNotificationsAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>(MarkAllNotificationsAsReadDocument, options);
      }
export type MarkAllNotificationsAsReadMutationHookResult = ReturnType<typeof useMarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationResult = Apollo.MutationResult<MarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationOptions = Apollo.BaseMutationOptions<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>;
export const MarkNotificationAsReadDocument = gql`
    mutation markNotificationAsRead($data: NotificationMarkReadInput!) {
  markNotificationAsRead(data: $data) {
    notificationId
    readAt
    status
  }
}
    `;
export type MarkNotificationAsReadMutationFn = Apollo.MutationFunction<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;

/**
 * __useMarkNotificationAsReadMutation__
 *
 * To run a mutation, you first call `useMarkNotificationAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationAsReadMutation, { data, loading, error }] = useMarkNotificationAsReadMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useMarkNotificationAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>(MarkNotificationAsReadDocument, options);
      }
export type MarkNotificationAsReadMutationHookResult = ReturnType<typeof useMarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationResult = Apollo.MutationResult<MarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationOptions = Apollo.BaseMutationOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;
export const NotificationCreatedDocument = gql`
    subscription notificationCreated($userId: Int!) {
  notificationCreated(userId: $userId) {
    notificationId
    userId
    channel
    template
    subject
    body
    entityType
    entityId
    status
    readAt
    createdAt
  }
}
    `;

/**
 * __useNotificationCreatedSubscription__
 *
 * To run a query within a React component, call `useNotificationCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNotificationCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationCreatedSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNotificationCreatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<NotificationCreatedSubscription, NotificationCreatedSubscriptionVariables> & ({ variables: NotificationCreatedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NotificationCreatedSubscription, NotificationCreatedSubscriptionVariables>(NotificationCreatedDocument, options);
      }
export type NotificationCreatedSubscriptionHookResult = ReturnType<typeof useNotificationCreatedSubscription>;
export type NotificationCreatedSubscriptionResult = Apollo.SubscriptionResult<NotificationCreatedSubscription>;
export const NotificationsByUserDocument = gql`
    query notificationsByUser($userId: Int!, $unreadOnly: Boolean, $limit: Int) {
  notificationsByUser(userId: $userId, unreadOnly: $unreadOnly, limit: $limit) {
    notificationId
    userId
    channel
    template
    subject
    body
    entityType
    entityId
    status
    readAt
    createdAt
  }
}
    `;

/**
 * __useNotificationsByUserQuery__
 *
 * To run a query within a React component, call `useNotificationsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationsByUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      unreadOnly: // value for 'unreadOnly'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useNotificationsByUserQuery(baseOptions: Apollo.QueryHookOptions<NotificationsByUserQuery, NotificationsByUserQueryVariables> & ({ variables: NotificationsByUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificationsByUserQuery, NotificationsByUserQueryVariables>(NotificationsByUserDocument, options);
      }
export function useNotificationsByUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationsByUserQuery, NotificationsByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificationsByUserQuery, NotificationsByUserQueryVariables>(NotificationsByUserDocument, options);
        }
// @ts-ignore
export function useNotificationsByUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<NotificationsByUserQuery, NotificationsByUserQueryVariables>): Apollo.UseSuspenseQueryResult<NotificationsByUserQuery, NotificationsByUserQueryVariables>;
export function useNotificationsByUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NotificationsByUserQuery, NotificationsByUserQueryVariables>): Apollo.UseSuspenseQueryResult<NotificationsByUserQuery | undefined, NotificationsByUserQueryVariables>;
export function useNotificationsByUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NotificationsByUserQuery, NotificationsByUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NotificationsByUserQuery, NotificationsByUserQueryVariables>(NotificationsByUserDocument, options);
        }
export type NotificationsByUserQueryHookResult = ReturnType<typeof useNotificationsByUserQuery>;
export type NotificationsByUserLazyQueryHookResult = ReturnType<typeof useNotificationsByUserLazyQuery>;
export type NotificationsByUserSuspenseQueryHookResult = ReturnType<typeof useNotificationsByUserSuspenseQuery>;
export type NotificationsByUserQueryResult = Apollo.QueryResult<NotificationsByUserQuery, NotificationsByUserQueryVariables>;
export const UnreadNotificationCountDocument = gql`
    query unreadNotificationCount($userId: Int!) {
  unreadNotificationCount(userId: $userId)
}
    `;

/**
 * __useUnreadNotificationCountQuery__
 *
 * To run a query within a React component, call `useUnreadNotificationCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnreadNotificationCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnreadNotificationCountQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUnreadNotificationCountQuery(baseOptions: Apollo.QueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables> & ({ variables: UnreadNotificationCountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>(UnreadNotificationCountDocument, options);
      }
export function useUnreadNotificationCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>(UnreadNotificationCountDocument, options);
        }
// @ts-ignore
export function useUnreadNotificationCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>): Apollo.UseSuspenseQueryResult<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>;
export function useUnreadNotificationCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>): Apollo.UseSuspenseQueryResult<UnreadNotificationCountQuery | undefined, UnreadNotificationCountQueryVariables>;
export function useUnreadNotificationCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>(UnreadNotificationCountDocument, options);
        }
export type UnreadNotificationCountQueryHookResult = ReturnType<typeof useUnreadNotificationCountQuery>;
export type UnreadNotificationCountLazyQueryHookResult = ReturnType<typeof useUnreadNotificationCountLazyQuery>;
export type UnreadNotificationCountSuspenseQueryHookResult = ReturnType<typeof useUnreadNotificationCountSuspenseQuery>;
export type UnreadNotificationCountQueryResult = Apollo.QueryResult<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>;
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
    offeredSlots {
      startsAt
      endsAt
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
export const QuoteEventForCustomerDocument = gql`
    subscription quoteEventForCustomer($customerId: Int!) {
  quoteEventForCustomer(customerId: $customerId) {
    eventType
    quoteId
    requestId
  }
}
    `;

/**
 * __useQuoteEventForCustomerSubscription__
 *
 * To run a query within a React component, call `useQuoteEventForCustomerSubscription` and pass it any options that fit your needs.
 * When your component renders, `useQuoteEventForCustomerSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuoteEventForCustomerSubscription({
 *   variables: {
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useQuoteEventForCustomerSubscription(baseOptions: Apollo.SubscriptionHookOptions<QuoteEventForCustomerSubscription, QuoteEventForCustomerSubscriptionVariables> & ({ variables: QuoteEventForCustomerSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<QuoteEventForCustomerSubscription, QuoteEventForCustomerSubscriptionVariables>(QuoteEventForCustomerDocument, options);
      }
export type QuoteEventForCustomerSubscriptionHookResult = ReturnType<typeof useQuoteEventForCustomerSubscription>;
export type QuoteEventForCustomerSubscriptionResult = Apollo.SubscriptionResult<QuoteEventForCustomerSubscription>;
export const QuoteEventForSupplierDocument = gql`
    subscription quoteEventForSupplier($supplierId: Int!) {
  quoteEventForSupplier(supplierId: $supplierId) {
    eventType
    quoteId
    requestId
  }
}
    `;

/**
 * __useQuoteEventForSupplierSubscription__
 *
 * To run a query within a React component, call `useQuoteEventForSupplierSubscription` and pass it any options that fit your needs.
 * When your component renders, `useQuoteEventForSupplierSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuoteEventForSupplierSubscription({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *   },
 * });
 */
export function useQuoteEventForSupplierSubscription(baseOptions: Apollo.SubscriptionHookOptions<QuoteEventForSupplierSubscription, QuoteEventForSupplierSubscriptionVariables> & ({ variables: QuoteEventForSupplierSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<QuoteEventForSupplierSubscription, QuoteEventForSupplierSubscriptionVariables>(QuoteEventForSupplierDocument, options);
      }
export type QuoteEventForSupplierSubscriptionHookResult = ReturnType<typeof useQuoteEventForSupplierSubscription>;
export type QuoteEventForSupplierSubscriptionResult = Apollo.SubscriptionResult<QuoteEventForSupplierSubscription>;
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
    offeredSlots {
      startsAt
      endsAt
    }
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
export const OpenRequestEventForSupplierDocument = gql`
    subscription openRequestEventForSupplier($supplierId: Int!) {
  openRequestEventForSupplier(supplierId: $supplierId) {
    eventType
    requestId
  }
}
    `;

/**
 * __useOpenRequestEventForSupplierSubscription__
 *
 * To run a query within a React component, call `useOpenRequestEventForSupplierSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOpenRequestEventForSupplierSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOpenRequestEventForSupplierSubscription({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *   },
 * });
 */
export function useOpenRequestEventForSupplierSubscription(baseOptions: Apollo.SubscriptionHookOptions<OpenRequestEventForSupplierSubscription, OpenRequestEventForSupplierSubscriptionVariables> & ({ variables: OpenRequestEventForSupplierSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OpenRequestEventForSupplierSubscription, OpenRequestEventForSupplierSubscriptionVariables>(OpenRequestEventForSupplierDocument, options);
      }
export type OpenRequestEventForSupplierSubscriptionHookResult = ReturnType<typeof useOpenRequestEventForSupplierSubscription>;
export type OpenRequestEventForSupplierSubscriptionResult = Apollo.SubscriptionResult<OpenRequestEventForSupplierSubscription>;
export const OpenRequestsForSupplierDocument = gql`
    query openRequestsForSupplier($supplierId: Int!, $limit: Int) {
  openRequestsForSupplier(supplierId: $supplierId, limit: $limit) {
    requestId
    customerId
    rawQuery
    categoryId
    city
    serviceDate
    guestCount
    budgetMin
    budgetMax
    status
    createdAt
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
 * __useOpenRequestsForSupplierQuery__
 *
 * To run a query within a React component, call `useOpenRequestsForSupplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useOpenRequestsForSupplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOpenRequestsForSupplierQuery({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useOpenRequestsForSupplierQuery(baseOptions: Apollo.QueryHookOptions<OpenRequestsForSupplierQuery, OpenRequestsForSupplierQueryVariables> & ({ variables: OpenRequestsForSupplierQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OpenRequestsForSupplierQuery, OpenRequestsForSupplierQueryVariables>(OpenRequestsForSupplierDocument, options);
      }
export function useOpenRequestsForSupplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OpenRequestsForSupplierQuery, OpenRequestsForSupplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OpenRequestsForSupplierQuery, OpenRequestsForSupplierQueryVariables>(OpenRequestsForSupplierDocument, options);
        }
// @ts-ignore
export function useOpenRequestsForSupplierSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OpenRequestsForSupplierQuery, OpenRequestsForSupplierQueryVariables>): Apollo.UseSuspenseQueryResult<OpenRequestsForSupplierQuery, OpenRequestsForSupplierQueryVariables>;
export function useOpenRequestsForSupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OpenRequestsForSupplierQuery, OpenRequestsForSupplierQueryVariables>): Apollo.UseSuspenseQueryResult<OpenRequestsForSupplierQuery | undefined, OpenRequestsForSupplierQueryVariables>;
export function useOpenRequestsForSupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OpenRequestsForSupplierQuery, OpenRequestsForSupplierQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OpenRequestsForSupplierQuery, OpenRequestsForSupplierQueryVariables>(OpenRequestsForSupplierDocument, options);
        }
export type OpenRequestsForSupplierQueryHookResult = ReturnType<typeof useOpenRequestsForSupplierQuery>;
export type OpenRequestsForSupplierLazyQueryHookResult = ReturnType<typeof useOpenRequestsForSupplierLazyQuery>;
export type OpenRequestsForSupplierSuspenseQueryHookResult = ReturnType<typeof useOpenRequestsForSupplierSuspenseQuery>;
export type OpenRequestsForSupplierQueryResult = Apollo.QueryResult<OpenRequestsForSupplierQuery, OpenRequestsForSupplierQueryVariables>;
export const RequestEventForCustomerDocument = gql`
    subscription requestEventForCustomer($customerId: Int!) {
  requestEventForCustomer(customerId: $customerId) {
    eventType
    requestId
  }
}
    `;

/**
 * __useRequestEventForCustomerSubscription__
 *
 * To run a query within a React component, call `useRequestEventForCustomerSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRequestEventForCustomerSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequestEventForCustomerSubscription({
 *   variables: {
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useRequestEventForCustomerSubscription(baseOptions: Apollo.SubscriptionHookOptions<RequestEventForCustomerSubscription, RequestEventForCustomerSubscriptionVariables> & ({ variables: RequestEventForCustomerSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<RequestEventForCustomerSubscription, RequestEventForCustomerSubscriptionVariables>(RequestEventForCustomerDocument, options);
      }
export type RequestEventForCustomerSubscriptionHookResult = ReturnType<typeof useRequestEventForCustomerSubscription>;
export type RequestEventForCustomerSubscriptionResult = Apollo.SubscriptionResult<RequestEventForCustomerSubscription>;
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
export const CreateReviewDocument = gql`
    mutation createReview($data: ReviewCreateInput!) {
  createReview(data: $data) {
    reviewId
    bookingId
    customerId
    supplierId
    rating
    text
    ratingQuality
    ratingCommunication
    ratingValue
    ratingPunctuality
    createdAt
  }
}
    `;
export type CreateReviewMutationFn = Apollo.MutationFunction<CreateReviewMutation, CreateReviewMutationVariables>;

/**
 * __useCreateReviewMutation__
 *
 * To run a mutation, you first call `useCreateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReviewMutation, { data, loading, error }] = useCreateReviewMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateReviewMutation(baseOptions?: Apollo.MutationHookOptions<CreateReviewMutation, CreateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReviewMutation, CreateReviewMutationVariables>(CreateReviewDocument, options);
      }
export type CreateReviewMutationHookResult = ReturnType<typeof useCreateReviewMutation>;
export type CreateReviewMutationResult = Apollo.MutationResult<CreateReviewMutation>;
export type CreateReviewMutationOptions = Apollo.BaseMutationOptions<CreateReviewMutation, CreateReviewMutationVariables>;
export const DeleteReviewDocument = gql`
    mutation deleteReview($data: ReviewDeleteInput!) {
  deleteReview(data: $data)
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
 *      data: // value for 'data'
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
export const UpdateReviewDocument = gql`
    mutation updateReview($data: ReviewUpdateInput!) {
  updateReview(data: $data) {
    reviewId
    bookingId
    rating
    text
    ratingQuality
    ratingCommunication
    ratingValue
    ratingPunctuality
    createdAt
  }
}
    `;
export type UpdateReviewMutationFn = Apollo.MutationFunction<UpdateReviewMutation, UpdateReviewMutationVariables>;

/**
 * __useUpdateReviewMutation__
 *
 * To run a mutation, you first call `useUpdateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReviewMutation, { data, loading, error }] = useUpdateReviewMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateReviewMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReviewMutation, UpdateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReviewMutation, UpdateReviewMutationVariables>(UpdateReviewDocument, options);
      }
export type UpdateReviewMutationHookResult = ReturnType<typeof useUpdateReviewMutation>;
export type UpdateReviewMutationResult = Apollo.MutationResult<UpdateReviewMutation>;
export type UpdateReviewMutationOptions = Apollo.BaseMutationOptions<UpdateReviewMutation, UpdateReviewMutationVariables>;
export const CreateServiceDocument = gql`
    mutation createService($data: ServiceCreateInput!) {
  createService(data: $data) {
    serviceId
    supplierId
    categoryId
    name
    description
    pricingModel
    basePrice
    currency
    minTotalPrice
    maxTotalPrice
    minUnits
    maxUnits
    unitLabel
    active
  }
}
    `;
export type CreateServiceMutationFn = Apollo.MutationFunction<CreateServiceMutation, CreateServiceMutationVariables>;

/**
 * __useCreateServiceMutation__
 *
 * To run a mutation, you first call `useCreateServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createServiceMutation, { data, loading, error }] = useCreateServiceMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateServiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateServiceMutation, CreateServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateServiceMutation, CreateServiceMutationVariables>(CreateServiceDocument, options);
      }
export type CreateServiceMutationHookResult = ReturnType<typeof useCreateServiceMutation>;
export type CreateServiceMutationResult = Apollo.MutationResult<CreateServiceMutation>;
export type CreateServiceMutationOptions = Apollo.BaseMutationOptions<CreateServiceMutation, CreateServiceMutationVariables>;
export const DeleteServiceDocument = gql`
    mutation deleteService($data: ServiceDeleteInput!) {
  deleteService(data: $data)
}
    `;
export type DeleteServiceMutationFn = Apollo.MutationFunction<DeleteServiceMutation, DeleteServiceMutationVariables>;

/**
 * __useDeleteServiceMutation__
 *
 * To run a mutation, you first call `useDeleteServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteServiceMutation, { data, loading, error }] = useDeleteServiceMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteServiceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteServiceMutation, DeleteServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteServiceMutation, DeleteServiceMutationVariables>(DeleteServiceDocument, options);
      }
export type DeleteServiceMutationHookResult = ReturnType<typeof useDeleteServiceMutation>;
export type DeleteServiceMutationResult = Apollo.MutationResult<DeleteServiceMutation>;
export type DeleteServiceMutationOptions = Apollo.BaseMutationOptions<DeleteServiceMutation, DeleteServiceMutationVariables>;
export const ServicesBySupplierDocument = gql`
    query servicesBySupplier($supplierId: Int!, $includeInactive: Boolean) {
  servicesBySupplier(supplierId: $supplierId, includeInactive: $includeInactive) {
    serviceId
    supplierId
    categoryId
    name
    description
    pricingModel
    basePrice
    currency
    minTotalPrice
    maxTotalPrice
    minUnits
    maxUnits
    unitLabel
    active
  }
}
    `;

/**
 * __useServicesBySupplierQuery__
 *
 * To run a query within a React component, call `useServicesBySupplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useServicesBySupplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useServicesBySupplierQuery({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *      includeInactive: // value for 'includeInactive'
 *   },
 * });
 */
export function useServicesBySupplierQuery(baseOptions: Apollo.QueryHookOptions<ServicesBySupplierQuery, ServicesBySupplierQueryVariables> & ({ variables: ServicesBySupplierQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ServicesBySupplierQuery, ServicesBySupplierQueryVariables>(ServicesBySupplierDocument, options);
      }
export function useServicesBySupplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ServicesBySupplierQuery, ServicesBySupplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ServicesBySupplierQuery, ServicesBySupplierQueryVariables>(ServicesBySupplierDocument, options);
        }
// @ts-ignore
export function useServicesBySupplierSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ServicesBySupplierQuery, ServicesBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<ServicesBySupplierQuery, ServicesBySupplierQueryVariables>;
export function useServicesBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ServicesBySupplierQuery, ServicesBySupplierQueryVariables>): Apollo.UseSuspenseQueryResult<ServicesBySupplierQuery | undefined, ServicesBySupplierQueryVariables>;
export function useServicesBySupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ServicesBySupplierQuery, ServicesBySupplierQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ServicesBySupplierQuery, ServicesBySupplierQueryVariables>(ServicesBySupplierDocument, options);
        }
export type ServicesBySupplierQueryHookResult = ReturnType<typeof useServicesBySupplierQuery>;
export type ServicesBySupplierLazyQueryHookResult = ReturnType<typeof useServicesBySupplierLazyQuery>;
export type ServicesBySupplierSuspenseQueryHookResult = ReturnType<typeof useServicesBySupplierSuspenseQuery>;
export type ServicesBySupplierQueryResult = Apollo.QueryResult<ServicesBySupplierQuery, ServicesBySupplierQueryVariables>;
export const UpdateServiceDocument = gql`
    mutation updateService($data: ServiceUpdateInput!) {
  updateService(data: $data) {
    serviceId
    supplierId
    categoryId
    name
    description
    pricingModel
    basePrice
    currency
    minTotalPrice
    maxTotalPrice
    minUnits
    maxUnits
    unitLabel
    active
  }
}
    `;
export type UpdateServiceMutationFn = Apollo.MutationFunction<UpdateServiceMutation, UpdateServiceMutationVariables>;

/**
 * __useUpdateServiceMutation__
 *
 * To run a mutation, you first call `useUpdateServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateServiceMutation, { data, loading, error }] = useUpdateServiceMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateServiceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateServiceMutation, UpdateServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateServiceMutation, UpdateServiceMutationVariables>(UpdateServiceDocument, options);
      }
export type UpdateServiceMutationHookResult = ReturnType<typeof useUpdateServiceMutation>;
export type UpdateServiceMutationResult = Apollo.MutationResult<UpdateServiceMutation>;
export type UpdateServiceMutationOptions = Apollo.BaseMutationOptions<UpdateServiceMutation, UpdateServiceMutationVariables>;
export const DeleteSupplierMediaDocument = gql`
    mutation deleteSupplierMedia($data: SupplierMediaDeleteInput!) {
  deleteSupplierMedia(data: $data)
}
    `;
export type DeleteSupplierMediaMutationFn = Apollo.MutationFunction<DeleteSupplierMediaMutation, DeleteSupplierMediaMutationVariables>;

/**
 * __useDeleteSupplierMediaMutation__
 *
 * To run a mutation, you first call `useDeleteSupplierMediaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSupplierMediaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSupplierMediaMutation, { data, loading, error }] = useDeleteSupplierMediaMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteSupplierMediaMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSupplierMediaMutation, DeleteSupplierMediaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSupplierMediaMutation, DeleteSupplierMediaMutationVariables>(DeleteSupplierMediaDocument, options);
      }
export type DeleteSupplierMediaMutationHookResult = ReturnType<typeof useDeleteSupplierMediaMutation>;
export type DeleteSupplierMediaMutationResult = Apollo.MutationResult<DeleteSupplierMediaMutation>;
export type DeleteSupplierMediaMutationOptions = Apollo.BaseMutationOptions<DeleteSupplierMediaMutation, DeleteSupplierMediaMutationVariables>;
export const ReorderSupplierMediaDocument = gql`
    mutation reorderSupplierMedia($data: SupplierMediaReorderInput!) {
  reorderSupplierMedia(data: $data)
}
    `;
export type ReorderSupplierMediaMutationFn = Apollo.MutationFunction<ReorderSupplierMediaMutation, ReorderSupplierMediaMutationVariables>;

/**
 * __useReorderSupplierMediaMutation__
 *
 * To run a mutation, you first call `useReorderSupplierMediaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReorderSupplierMediaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reorderSupplierMediaMutation, { data, loading, error }] = useReorderSupplierMediaMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useReorderSupplierMediaMutation(baseOptions?: Apollo.MutationHookOptions<ReorderSupplierMediaMutation, ReorderSupplierMediaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReorderSupplierMediaMutation, ReorderSupplierMediaMutationVariables>(ReorderSupplierMediaDocument, options);
      }
export type ReorderSupplierMediaMutationHookResult = ReturnType<typeof useReorderSupplierMediaMutation>;
export type ReorderSupplierMediaMutationResult = Apollo.MutationResult<ReorderSupplierMediaMutation>;
export type ReorderSupplierMediaMutationOptions = Apollo.BaseMutationOptions<ReorderSupplierMediaMutation, ReorderSupplierMediaMutationVariables>;
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
    promotionTier
    promotionStartDate
    promotionEndDate
    businessPhone
    businessEmail
    businessPhoneAlt
    businessEmailAlt
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
export const SetSupplierCategoriesDocument = gql`
    mutation setSupplierCategories($data: SupplierCategoriesInput!) {
  setSupplierCategories(data: $data)
}
    `;
export type SetSupplierCategoriesMutationFn = Apollo.MutationFunction<SetSupplierCategoriesMutation, SetSupplierCategoriesMutationVariables>;

/**
 * __useSetSupplierCategoriesMutation__
 *
 * To run a mutation, you first call `useSetSupplierCategoriesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSupplierCategoriesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSupplierCategoriesMutation, { data, loading, error }] = useSetSupplierCategoriesMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSetSupplierCategoriesMutation(baseOptions?: Apollo.MutationHookOptions<SetSupplierCategoriesMutation, SetSupplierCategoriesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetSupplierCategoriesMutation, SetSupplierCategoriesMutationVariables>(SetSupplierCategoriesDocument, options);
      }
export type SetSupplierCategoriesMutationHookResult = ReturnType<typeof useSetSupplierCategoriesMutation>;
export type SetSupplierCategoriesMutationResult = Apollo.MutationResult<SetSupplierCategoriesMutation>;
export type SetSupplierCategoriesMutationOptions = Apollo.BaseMutationOptions<SetSupplierCategoriesMutation, SetSupplierCategoriesMutationVariables>;
export const SupplierDashboardStatsDocument = gql`
    query supplierDashboardStats($supplierId: Int!) {
  supplierDashboardStats(supplierId: $supplierId) {
    responseRate
    conversionRate
    activeLeadsCount
    mtdEarnings
    mtdGross
    currency
    platformFeeRate
    weeklyLeadCounts
  }
}
    `;

/**
 * __useSupplierDashboardStatsQuery__
 *
 * To run a query within a React component, call `useSupplierDashboardStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSupplierDashboardStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSupplierDashboardStatsQuery({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *   },
 * });
 */
export function useSupplierDashboardStatsQuery(baseOptions: Apollo.QueryHookOptions<SupplierDashboardStatsQuery, SupplierDashboardStatsQueryVariables> & ({ variables: SupplierDashboardStatsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SupplierDashboardStatsQuery, SupplierDashboardStatsQueryVariables>(SupplierDashboardStatsDocument, options);
      }
export function useSupplierDashboardStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SupplierDashboardStatsQuery, SupplierDashboardStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SupplierDashboardStatsQuery, SupplierDashboardStatsQueryVariables>(SupplierDashboardStatsDocument, options);
        }
// @ts-ignore
export function useSupplierDashboardStatsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SupplierDashboardStatsQuery, SupplierDashboardStatsQueryVariables>): Apollo.UseSuspenseQueryResult<SupplierDashboardStatsQuery, SupplierDashboardStatsQueryVariables>;
export function useSupplierDashboardStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SupplierDashboardStatsQuery, SupplierDashboardStatsQueryVariables>): Apollo.UseSuspenseQueryResult<SupplierDashboardStatsQuery | undefined, SupplierDashboardStatsQueryVariables>;
export function useSupplierDashboardStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SupplierDashboardStatsQuery, SupplierDashboardStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SupplierDashboardStatsQuery, SupplierDashboardStatsQueryVariables>(SupplierDashboardStatsDocument, options);
        }
export type SupplierDashboardStatsQueryHookResult = ReturnType<typeof useSupplierDashboardStatsQuery>;
export type SupplierDashboardStatsLazyQueryHookResult = ReturnType<typeof useSupplierDashboardStatsLazyQuery>;
export type SupplierDashboardStatsSuspenseQueryHookResult = ReturnType<typeof useSupplierDashboardStatsSuspenseQuery>;
export type SupplierDashboardStatsQueryResult = Apollo.QueryResult<SupplierDashboardStatsQuery, SupplierDashboardStatsQueryVariables>;
export const SupplierDocument = gql`
    query supplier($where: SupplierWhereInput!) {
  supplier(where: $where) {
    supplierId
    companyName
    slug
    tagline
    description
    businessPhone
    businessEmail
    businessPhoneAlt
    businessEmailAlt
    websiteUrl
    city
    rating
    reviewCount
    responseTimeMinutes
    minCapacity
    maxCapacity
    verified
    premium
    promotionTier
    promotionStartDate
    promotionEndDate
    media {
      mediaAssetId
      url
      thumbnailUrl
      altText
      displayOrder
    }
    services {
      serviceId
      name
      description
      pricingModel
      basePrice
      currency
    }
    categories {
      categoryId
      isPrimary
      category {
        categoryId
        categoryName
      }
    }
    reviewsReceived {
      reviewId
      rating
      text
      ratingQuality
      ratingCommunication
      ratingValue
      ratingPunctuality
      supplierResponse
      createdAt
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
 *      where: // value for 'where'
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
export const SuppliersDocument = gql`
    query suppliers {
  suppliers {
    supplierId
    companyName
    city
    rating
    reviewCount
    verified
    promotionTier
    promotionStartDate
    promotionEndDate
    categories {
      isPrimary
      category {
        categoryId
        categoryName
      }
    }
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
export const UpdateSupplierDocument = gql`
    mutation updateSupplier($data: SupplierUpdateInput!) {
  updateSupplier(data: $data) {
    supplierId
    companyName
    slug
    tagline
    description
    businessPhone
    businessEmail
    businessPhoneAlt
    businessEmailAlt
    websiteUrl
    city
    minCapacity
    maxCapacity
    responseTimeMinutes
  }
}
    `;
export type UpdateSupplierMutationFn = Apollo.MutationFunction<UpdateSupplierMutation, UpdateSupplierMutationVariables>;

/**
 * __useUpdateSupplierMutation__
 *
 * To run a mutation, you first call `useUpdateSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSupplierMutation, { data, loading, error }] = useUpdateSupplierMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateSupplierMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSupplierMutation, UpdateSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSupplierMutation, UpdateSupplierMutationVariables>(UpdateSupplierDocument, options);
      }
export type UpdateSupplierMutationHookResult = ReturnType<typeof useUpdateSupplierMutation>;
export type UpdateSupplierMutationResult = Apollo.MutationResult<UpdateSupplierMutation>;
export type UpdateSupplierMutationOptions = Apollo.BaseMutationOptions<UpdateSupplierMutation, UpdateSupplierMutationVariables>;
export const UpdateUserDocument = gql`
    mutation updateUser($data: UserUpdateInput!) {
  updateUser(data: $data) {
    userId
    name
    phone
    country
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';
import type { ModelKey } from '../jotai/ai-usage.atom';

// ── Device ID ──────────────────────────────────────────────────────────────
//
// Even with auth in place we still mint a deviceId. It serves two purposes:
//   1. Lets unauthenticated (guest) callers keep their conversation history
//      scoped to the browser.
//   2. The backend accepts it as a fallback when no JWT is present.
//
// When the user IS authenticated, the backend ignores deviceId for ownership
// and ties conversations to userId instead — but we still send it so the row
// records which device created the chat (useful for telemetry / future
// guest→user migration).
export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return '';
  const KEY = 'solvo:device-id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

// ── Types (mirror the GraphQL schema) ──────────────────────────────────────

export interface ConversationSummary {
  conversationId: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  userId?: number | null;
  deviceId?: string | null;
  messages: Array<{ content: string; role: string; createdAt: string }>;
}

export interface ConversationDetail extends ConversationSummary {
  messages: ConversationMessage[];
}

export interface ConversationMessage {
  messageId: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  providersJson?: string;
  createdAt: string;
}

export interface SendMessageResult {
  messageId: string;
  role: string;
  content: string;
  model: string;
  usage?: { inputTokens?: number; outputTokens?: number };
  createdAt: string;
}

// ── GraphQL documents ──────────────────────────────────────────────────────

const AI_CONVERSATIONS = gql`
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

const AI_CONVERSATION = gql`
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

const CREATE_AI_CONVERSATION = gql`
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

const UPDATE_AI_CONVERSATION = gql`
  mutation updateAiConversation(
    $data: AiConversationUpdateInput!
    $deviceId: String
  ) {
    updateAiConversation(data: $data, deviceId: $deviceId) {
      conversationId
      title
      model
      updatedAt
    }
  }
`;

const DELETE_AI_CONVERSATION = gql`
  mutation deleteAiConversation($conversationId: String!, $deviceId: String) {
    deleteAiConversation(conversationId: $conversationId, deviceId: $deviceId)
  }
`;

const SEND_AI_MESSAGE = gql`
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

const UPDATE_AI_MESSAGE_PROVIDERS = gql`
  mutation updateAiMessageProviders(
    $data: AiMessageProvidersUpdateInput!
    $deviceId: String
  ) {
    updateAiMessageProviders(data: $data, deviceId: $deviceId) {
      messageId
      providersJson
    }
  }
`;

const MERGE_GUEST_AI_CONVERSATIONS = gql`
  mutation mergeGuestAiConversations($deviceId: String!) {
    mergeGuestAiConversations(deviceId: $deviceId)
  }
`;

// ── Apollo client accessor ─────────────────────────────────────────────────
//
// The page-level `useApolloClient()` is the canonical way to get the client
// in React components, but the existing call sites in pages/index.tsx import
// these functions standalone. To keep that pattern working we expose a
// module-level setter that _app.tsx (or any provider) can call once.
//
// In practice we lazily grab the client from the Apollo cache global on first
// use: when @apollo/client v3 boots, it exposes the active client via the
// `client` field on any rendered component's context. We avoid that fragility
// by requiring callers to set it explicitly.

let _client: ApolloClient<NormalizedCacheObject> | null = null;

export function setConversationApolloClient(
  client: ApolloClient<NormalizedCacheObject>,
) {
  _client = client;
}

function client(): ApolloClient<NormalizedCacheObject> {
  if (!_client) {
    throw new Error(
      'Apollo client not initialised for conversation.service. Call ' +
        'setConversationApolloClient(client) once after constructing the ' +
        'ApolloClient (see pages/_app.tsx).',
    );
  }
  return _client;
}

// ── API ────────────────────────────────────────────────────────────────────

export async function listConversations(): Promise<ConversationSummary[]> {
  const { data, error } = await client().query<{
    aiConversations: ConversationSummary[];
  }>({
    query: AI_CONVERSATIONS,
    variables: { deviceId: getOrCreateDeviceId() },
    fetchPolicy: 'network-only',
  });
  if (error) throw error;
  return data.aiConversations;
}

export async function createConversation(
  title: string,
  model: ModelKey,
): Promise<ConversationSummary> {
  const { data, errors } = await client().mutate<{
    createAiConversation: ConversationSummary;
  }>({
    mutation: CREATE_AI_CONVERSATION,
    variables: {
      data: { title, model, deviceId: getOrCreateDeviceId() },
    },
  });
  if (errors?.length) throw errors[0];
  // Apollo can return `data: null` on hard failure — guard for the call sites
  // that destructure conversationId immediately.
  return (
    data?.createAiConversation ?? {
      conversationId: '',
      title,
      model: model as unknown as string,
      createdAt: '',
      updatedAt: '',
      messages: [],
    }
  );
}

export async function getConversation(
  conversationId: string,
): Promise<ConversationDetail> {
  const { data, error } = await client().query<{
    aiConversation: ConversationDetail;
  }>({
    query: AI_CONVERSATION,
    variables: { conversationId, deviceId: getOrCreateDeviceId() },
    fetchPolicy: 'network-only',
  });
  if (error) throw error;
  return data.aiConversation;
}

export async function sendMessage(
  conversationId: string,
  content: string,
  model?: ModelKey,
  system?: string,
): Promise<SendMessageResult> {
  const { data, errors } = await client().mutate<{
    sendAiMessage: SendMessageResult;
  }>({
    mutation: SEND_AI_MESSAGE,
    variables: {
      data: { conversationId, content, model, system },
      deviceId: getOrCreateDeviceId(),
    },
  });
  if (errors?.length) throw errors[0];
  if (!data?.sendAiMessage) {
    throw new Error('sendAiMessage returned no data');
  }
  return data.sendAiMessage;
}

export async function deleteConversation(id: string): Promise<void> {
  const { errors } = await client().mutate<{ deleteAiConversation: boolean }>({
    mutation: DELETE_AI_CONVERSATION,
    variables: { conversationId: id, deviceId: getOrCreateDeviceId() },
  });
  if (errors?.length) throw errors[0];
}

export async function updateMessageProviders(
  conversationId: string,
  messageId: string,
  providersJson: string,
): Promise<void> {
  const { errors } = await client().mutate({
    mutation: UPDATE_AI_MESSAGE_PROVIDERS,
    variables: {
      data: { conversationId, messageId, providersJson },
      deviceId: getOrCreateDeviceId(),
    },
  });
  if (errors?.length) throw errors[0];
}

/**
 * Claim any guest (userId-null) conversations created on this device and
 * link them to the now-authenticated user. Call this right after a
 * successful login so chats started before sign-in follow the user.
 * Silently returns 0 if not authenticated — the backend ignores the call
 * when no JWT is present.
 */
export async function mergeGuestConversations(): Promise<number> {
  const { data, errors } = await client().mutate<{
    mergeGuestAiConversations: number;
  }>({
    mutation: MERGE_GUEST_AI_CONVERSATIONS,
    variables: { deviceId: getOrCreateDeviceId() },
  });
  if (errors?.length) throw errors[0];
  return data?.mergeGuestAiConversations ?? 0;
}

export async function renameConversation(
  id: string,
  title: string,
): Promise<ConversationSummary> {
  const { data, errors } = await client().mutate<{
    updateAiConversation: ConversationSummary;
  }>({
    mutation: UPDATE_AI_CONVERSATION,
    variables: {
      data: { conversationId: id, title },
      deviceId: getOrCreateDeviceId(),
    },
  });
  if (errors?.length) throw errors[0];
  return (
    data?.updateAiConversation ?? {
      conversationId: id,
      title,
      model: '',
      createdAt: '',
      updatedAt: '',
      messages: [],
    }
  );
}

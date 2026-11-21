import { gql } from '@apollo/client';

import { MergeGuestContactsDocument } from '@generated';
import { getApolloClient } from './apollo.client';

/**
 * Persisted AI chats. Signed-in users own their chats by userId; guests by
 * a per-browser device id, so the chat works without an account. After
 * sign-in, `mergeGuestData()` moves this device's guest chats and contacts
 * onto the account.
 */

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

export interface ConversationSummary {
  conversationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{ content: string; role: string; createdAt: string }>;
}

export interface ConversationMessage {
  messageId: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  /** Provider that answered ('claude-haiku' | 'gemini-flash'). */
  model?: string;
  providersJson?: string;
  createdAt: string;
}

export interface ConversationDetail extends Omit<ConversationSummary, 'messages'> {
  messages: ConversationMessage[];
}

export interface SendMessageResult {
  messageId: string;
  role: string;
  content: string;
  model: string;
  createdAt: string;
}

const AI_CONVERSATIONS = gql`
  query aiConversations($deviceId: String) {
    aiConversations(deviceId: $deviceId) {
      conversationId
      title
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
      createdAt
      updatedAt
      messages {
        messageId
        conversationId
        role
        content
        model
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
      createdAt
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
      createdAt
    }
  }
`;

const UPDATE_AI_MESSAGE_PROVIDERS = gql`
  mutation updateAiMessageProviders($data: AiMessageProvidersUpdateInput!, $deviceId: String) {
    updateAiMessageProviders(data: $data, deviceId: $deviceId) {
      messageId
    }
  }
`;

const MERGE_GUEST_AI_CONVERSATIONS = gql`
  mutation mergeGuestAiConversations($deviceId: String!) {
    mergeGuestAiConversations(deviceId: $deviceId)
  }
`;

const ROLLBACK_LAST_AI_TURN = gql`
  mutation rollbackLastAiTurn($conversationId: String!, $deviceId: String) {
    rollbackLastAiTurn(conversationId: $conversationId, deviceId: $deviceId)
  }
`;

const client = getApolloClient;

export async function listConversations(): Promise<ConversationSummary[]> {
  const { data, error } = await client().query<{ aiConversations: ConversationSummary[] }>({
    query: AI_CONVERSATIONS,
    variables: { deviceId: getOrCreateDeviceId() },
    fetchPolicy: 'network-only',
  });
  if (error) throw error;
  return data.aiConversations;
}

export async function createConversation(title: string): Promise<ConversationSummary> {
  const { data, errors } = await client().mutate<{ createAiConversation: ConversationSummary }>({
    mutation: CREATE_AI_CONVERSATION,
    variables: { data: { title, deviceId: getOrCreateDeviceId() } },
  });
  if (errors?.length) throw errors[0];
  if (!data?.createAiConversation) throw new Error('createAiConversation returned no data');
  return { ...data.createAiConversation, messages: [] };
}

export async function getConversation(conversationId: string): Promise<ConversationDetail> {
  const { data, error } = await client().query<{ aiConversation: ConversationDetail }>({
    query: AI_CONVERSATION,
    variables: { conversationId, deviceId: getOrCreateDeviceId() },
    fetchPolicy: 'network-only',
  });
  if (error) throw error;
  return data.aiConversation;
}

/**
 * Persist the user's message, get the AI reply (server keeps the history).
 * `system` = this turn's grounding block, `cachedSystem` = the stable prompt.
 */
export async function sendMessage(
  conversationId: string,
  content: string,
  opts: { system?: string; cachedSystem?: string; signal?: AbortSignal } = {},
): Promise<SendMessageResult> {
  const { data, errors } = await client().mutate<{ sendAiMessage: SendMessageResult }>({
    mutation: SEND_AI_MESSAGE,
    variables: {
      data: { conversationId, content, system: opts.system, cachedSystem: opts.cachedSystem },
      deviceId: getOrCreateDeviceId(),
    },
    ...(opts.signal ? { context: { fetchOptions: { signal: opts.signal } } } : {}),
  });
  if (errors?.length) throw errors[0];
  if (!data?.sendAiMessage) throw new Error('sendAiMessage returned no data');
  return data.sendAiMessage;
}

/** Undo the last turn server-side (used by "stop"). Best-effort. */
export async function rollbackLastTurn(conversationId: string): Promise<number> {
  const { data, errors } = await client().mutate<{ rollbackLastAiTurn: number }>({
    mutation: ROLLBACK_LAST_AI_TURN,
    variables: { conversationId, deviceId: getOrCreateDeviceId() },
  });
  if (errors?.length) throw errors[0];
  return data?.rollbackLastAiTurn ?? 0;
}

export async function deleteConversation(id: string): Promise<void> {
  const { errors } = await client().mutate({
    mutation: DELETE_AI_CONVERSATION,
    variables: { conversationId: id, deviceId: getOrCreateDeviceId() },
  });
  if (errors?.length) throw errors[0];
}

/** Save the supplier cards shown under a reply so a reload shows them again. */
export async function updateMessageProviders(
  conversationId: string,
  messageId: string,
  providersJson: string,
): Promise<void> {
  const { errors } = await client().mutate({
    mutation: UPDATE_AI_MESSAGE_PROVIDERS,
    variables: { data: { conversationId, messageId, providersJson }, deviceId: getOrCreateDeviceId() },
  });
  if (errors?.length) throw errors[0];
}

/**
 * After sign-in: move this device's guest chats AND guest contacts onto the
 * account. Best-effort — sign-in never fails because of it.
 */
export async function mergeGuestData(): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  if (!deviceId) return;
  await Promise.allSettled([
    client().mutate({ mutation: MERGE_GUEST_AI_CONVERSATIONS, variables: { deviceId } }),
    client().mutate({ mutation: MergeGuestContactsDocument, variables: { deviceId } }),
  ]);
}

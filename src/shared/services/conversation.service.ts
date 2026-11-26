import { gql } from '@apollo/client';

import { MergeGuestContactsDocument } from '@generated';
import { getApolloClient } from './apollo.client';

/**
 * Persisted AI chats (read / delete). New turns go through the `chatTurn`
 * mutation (see pages/index.tsx). Signed-in users own chats by userId;
 * guests by a per-browser device id. After sign-in, `mergeGuestData()` moves
 * this device's guest chats and contacts onto the account.
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

const DELETE_AI_CONVERSATION = gql`
  mutation deleteAiConversation($conversationId: String!, $deviceId: String) {
    deleteAiConversation(conversationId: $conversationId, deviceId: $deviceId)
  }
`;

const MERGE_GUEST_AI_CONVERSATIONS = gql`
  mutation mergeGuestAiConversations($deviceId: String!) {
    mergeGuestAiConversations(deviceId: $deviceId)
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

export async function getConversation(conversationId: string): Promise<ConversationDetail> {
  const { data, error } = await client().query<{ aiConversation: ConversationDetail }>({
    query: AI_CONVERSATION,
    variables: { conversationId, deviceId: getOrCreateDeviceId() },
    fetchPolicy: 'network-only',
  });
  if (error) throw error;
  return data.aiConversation;
}

export async function deleteConversation(id: string): Promise<void> {
  const { errors } = await client().mutate({
    mutation: DELETE_AI_CONVERSATION,
    variables: { conversationId: id, deviceId: getOrCreateDeviceId() },
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

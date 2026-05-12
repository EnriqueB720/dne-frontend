import type { ModelKey } from '../jotai/ai-usage.atom';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

// ── Device ID ──────────────────────────────────────────────────────────────
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

function deviceHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-device-id': getOrCreateDeviceId(),
  };
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface ConversationSummary {
  conversationId: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
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
  /** JSON-encoded ProviderData[] — populated client-side and persisted to DB */
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

// ── API calls ──────────────────────────────────────────────────────────────

export async function listConversations(): Promise<ConversationSummary[]> {
  const res = await fetch(`${API_URL}/chat/conversations`, {
    headers: deviceHeaders(),
  });
  if (!res.ok) throw new Error(`List conversations failed (${res.status})`);
  return res.json();
}

export async function createConversation(
  title: string,
  model: ModelKey,
): Promise<ConversationSummary> {
  const res = await fetch(`${API_URL}/chat/conversations`, {
    method: 'POST',
    headers: deviceHeaders(),
    body: JSON.stringify({ deviceId: getOrCreateDeviceId(), title, model }),
  });
  if (!res.ok) throw new Error(`Create conversation failed (${res.status})`);
  return res.json();
}

export async function getConversation(id: string): Promise<ConversationDetail> {
  const res = await fetch(`${API_URL}/chat/conversations/${id}`, {
    headers: deviceHeaders(),
  });
  if (!res.ok) throw new Error(`Get conversation failed (${res.status})`);
  return res.json();
}

export async function sendMessage(
  conversationId: string,
  content: string,
  model?: ModelKey,
  system?: string,
): Promise<SendMessageResult> {
  const res = await fetch(
    `${API_URL}/chat/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      headers: deviceHeaders(),
      body: JSON.stringify({ content, model, system }),
    },
  );
  if (!res.ok) throw new Error(`Send message failed (${res.status})`);
  return res.json();
}

export async function deleteConversation(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/chat/conversations/${id}`, {
    method: 'DELETE',
    headers: deviceHeaders(),
  });
  if (!res.ok) throw new Error(`Delete conversation failed (${res.status})`);
}

export async function updateMessageProviders(
  conversationId: string,
  messageId: string,
  providersJson: string,
): Promise<void> {
  const res = await fetch(
    `${API_URL}/chat/conversations/${conversationId}/messages/${messageId}`,
    {
      method: 'PATCH',
      headers: deviceHeaders(),
      body: JSON.stringify({ providersJson }),
    },
  );
  if (!res.ok) throw new Error(`Update providers failed (${res.status})`);
}

export async function renameConversation(
  id: string,
  title: string,
): Promise<ConversationSummary> {
  const res = await fetch(`${API_URL}/chat/conversations/${id}`, {
    method: 'PATCH',
    headers: deviceHeaders(),
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`Rename conversation failed (${res.status})`);
  return res.json();
}

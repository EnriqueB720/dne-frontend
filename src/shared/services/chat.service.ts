import { print } from 'graphql';

import { ChatTurnDocument, type ChatTurnInput, type ChatTurnMutation } from '@generated';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

/**
 * Run one chat turn (`chatTurn` mutation). Plain fetch on purpose: Apollo
 * replaces the caller's AbortSignal with its own, so "Stop" would not close
 * the request — and the API only skips saving a turn when the connection
 * closes. With fetch, aborting really hangs up and the turn leaves no trace.
 */
export async function runChatTurn(data: ChatTurnInput, signal: AbortSignal): Promise<ChatTurnMutation['chatTurn']> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('@token') : null;
  const res = await fetch(`${API_BASE}/graphql`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query: print(ChatTurnDocument), variables: { data } }),
    signal,
  });
  const json = (await res.json()) as { data?: ChatTurnMutation; errors?: Array<{ message: string }> };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  if (!json.data?.chatTurn) throw new Error('chatTurn returned no data');
  return json.data.chatTurn;
}

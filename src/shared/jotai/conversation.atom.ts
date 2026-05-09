import { atom } from 'jotai';
import type { ConversationSummary, ConversationMessage } from '../services/conversation.service';
import type { ProviderData } from '../components/molecules/providerCard/providerCard.component';
import type { ParsedQuery } from '../services/ai.service';

/** A message as it lives in the UI (extends DB shape with client-only fields). */
export interface UiMessage extends Omit<ConversationMessage, 'messageId' | 'conversationId'> {
  messageId?: string;
  /** Provider cards attached to this AI bubble (generated client-side, not DB-persisted in v1). */
  providers?: ProviderData[];
  /** Parsed query shown as interpretation card for the first turn. */
  parsedQuery?: ParsedQuery;
}

export interface ConversationState {
  /** All conversations for this device, newest first. */
  conversations: ConversationSummary[];
  /** ID of the currently open conversation, or null (hero / new-chat mode). */
  currentConvId: string | null;
  /** Messages for the open conversation. */
  messages: UiMessage[];
  /** True while waiting for an AI response. */
  waitingForAI: boolean;
}

const initialState: ConversationState = {
  conversations: [],
  currentConvId: null,
  messages: [],
  waitingForAI: false,
};

export const conversationAtom = atom<ConversationState>(initialState);

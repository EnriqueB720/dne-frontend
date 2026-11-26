import type { ChatSupplier } from './supplier';

/** A chat message as the UI holds it (the DB row plus client-only extras). */
export interface UiMessage {
  messageId?: string;
  role: 'user' | 'assistant';
  content: string;
  /** Which AI answered ('claude-haiku' / 'gemini-flash'). */
  model?: string;
  createdAt: string;
  /** Real suppliers shown under this reply (persisted as providers_json). */
  suppliers?: ChatSupplier[];
  /** What was searched ("fontanero") — shown in the "Solvo understood" card. */
  service?: string;
  /** The zone the search ran in, e.g. "Heredia" (null = nationwide). */
  zoneName?: string | null;
  /** Set when the user tapped "Contact" on a card: show its contact links. */
  contactFor?: ChatSupplier;
}

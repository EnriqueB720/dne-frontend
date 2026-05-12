import { atomWithStorage } from 'jotai/utils';

export type ModelKey = 'gemini-flash' | 'claude-haiku' | 'gpt-4o-mini';

export interface ModelUsage {
  requests: number;
  inputTokens: number;
  outputTokens: number;
  lastUsedAt?: string;
}

export type AiUsageState = Record<ModelKey, ModelUsage>;

export const EMPTY_USAGE: AiUsageState = {
  'gemini-flash': { requests: 0, inputTokens: 0, outputTokens: 0 },
  'claude-haiku': { requests: 0, inputTokens: 0, outputTokens: 0 },
  'gpt-4o-mini': { requests: 0, inputTokens: 0, outputTokens: 0 },
};

export const aiUsageAtom = atomWithStorage<AiUsageState>(
  'solvo:ai-usage',
  EMPTY_USAGE,
);

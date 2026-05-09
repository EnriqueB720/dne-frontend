import type { ModelKey } from '../jotai/ai-usage.atom';

export interface ModelMeta {
  key: ModelKey;
  shortLabel: string;
  fullName: string;
  apiId: string;
  // Pricing per 1M tokens, in USD
  inputPricePerMillion: number;
  outputPricePerMillion: number;
}

export const MODEL_META: Record<ModelKey, ModelMeta> = {
  'gemini-flash': {
    key: 'gemini-flash',
    shortLabel: 'Gemini',
    fullName: 'Gemini 2.5 Flash',
    apiId: 'gemini-2.5-flash',
    inputPricePerMillion: 0.3,
    outputPricePerMillion: 2.5,
  },
  'claude-haiku': {
    key: 'claude-haiku',
    shortLabel: 'Claude',
    fullName: 'Claude Haiku 4.5',
    apiId: 'claude-haiku-4-5-20251001',
    inputPricePerMillion: 1.0,
    outputPricePerMillion: 5.0,
  },
  'gpt-4o-mini': {
    key: 'gpt-4o-mini',
    shortLabel: 'GPT',
    fullName: 'GPT-4o mini',
    apiId: 'gpt-4o-mini',
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.6,
  },
};

export const MODEL_LIST: ModelMeta[] = [
  MODEL_META['gemini-flash'],
  MODEL_META['claude-haiku'],
  MODEL_META['gpt-4o-mini'],
];

export function estimateCostUsd(
  modelKey: ModelKey,
  inputTokens: number,
  outputTokens: number,
): number {
  const m = MODEL_META[modelKey];
  return (
    (inputTokens / 1_000_000) * m.inputPricePerMillion +
    (outputTokens / 1_000_000) * m.outputPricePerMillion
  );
}

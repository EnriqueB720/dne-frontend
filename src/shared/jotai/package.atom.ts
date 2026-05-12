import { atomWithStorage } from 'jotai/utils';
import type { ProviderData } from '../components/molecules/providerCard/providerCard.component';

export interface PackageItem extends ProviderData {
  /** Unique key within the package — name is stable enough for v1 */
  packageKey: string;
  /** Which service category this item fulfils (from the AI-parsed query) */
  serviceLabel?: string;
}

export interface PackageState {
  items: PackageItem[];
}

const EMPTY: PackageState = { items: [] };

/**
 * Persisted in localStorage so the package survives navigation and
 * conversation switches. Users can accumulate providers from multiple chats.
 */
export const packageAtom = atomWithStorage<PackageState>('solvo:package', EMPTY);

/** Stable key for a provider inside the package. */
export function packageKey(provider: ProviderData): string {
  return `${provider.name}__${provider.priceLabel}`;
}

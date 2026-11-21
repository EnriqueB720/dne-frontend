import { atom } from 'jotai';

export type Lang = 'es' | 'en';

/**
 * Current UI language. Starts as Spanish on the server and on the first
 * client render (so hydration matches), then <I18nBoot/> switches it to the
 * saved choice or the device language.
 */
export const langAtom = atom<Lang>('es');

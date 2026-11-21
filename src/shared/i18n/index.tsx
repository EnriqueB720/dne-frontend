import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';

import en from './messages.en';
import es, { type Messages } from './messages.es';
import { langAtom, type Lang } from './i18n.atom';

export type { Lang, Messages };
export { langAtom };

const DICTIONARIES: Record<Lang, Messages> = { es, en };

/** localStorage key for an explicit choice made with the language toggle. */
export const LANG_STORAGE_KEY = 'solvo:lang';

/**
 * Saved choice first, then the device/browser language, then Spanish
 * (Solvo launches in Costa Rica). Only 'es' and 'en' are supported.
 */
export function detectLanguage(): Lang {
  if (typeof window === 'undefined') return 'es';
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    /* storage blocked */
  }
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of prefs) {
    const base = (tag || '').toLowerCase().split('-')[0];
    if (base === 'es') return 'es';
    if (base === 'en') return 'en';
  }
  return 'es';
}

function lookup(dict: Messages, path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) => (node as any)?.[key], dict);
}

function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : `{${k}}`));
}

/**
 * `const { t, lang, setLang, messages } = useI18n()`
 *  - t('chat.placeholder')                 → string
 *  - t('chat.browse', { zone: 'Heredia' }) → interpolated
 *  - messages.home.prompts                 → arrays / objects
 * Unknown keys fall back to Spanish, then to the key itself.
 */
export function useI18n() {
  const [lang, setLangState] = useAtom(langAtom);
  const messages = DICTIONARIES[lang];

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>): string => {
      const hit = lookup(messages, path) ?? lookup(es, path);
      return typeof hit === 'string' ? interpolate(hit, vars) : path;
    },
    [messages],
  );

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      try {
        localStorage.setItem(LANG_STORAGE_KEY, next);
      } catch {
        /* storage blocked */
      }
    },
    [setLangState],
  );

  /** Locale for dates and numbers. */
  const locale = lang === 'es' ? 'es-CR' : 'en-US';

  return { lang, setLang, t, messages, locale };
}

/** Mount once in _app: applies the detected language after hydration. */
export function I18nBoot() {
  const [lang, setLang] = useAtom(langAtom);

  useEffect(() => {
    setLang(detectLanguage());
  }, [setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}

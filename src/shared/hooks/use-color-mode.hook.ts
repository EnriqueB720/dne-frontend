import { useCallback, useSyncExternalStore } from 'react';

export type ColorMode = 'light' | 'dark';

export const COLOR_MODE_STORAGE_KEY = 'solvo:color-mode';

/**
 * The `data-theme` attribute on <html> is the single source of truth — it is
 * what the CSS variables key off, and the inline script in `_document` has
 * already set it before React boots. Reading it through
 * `useSyncExternalStore` rather than mirroring it into React state means
 * there is no duplicate state to drift, and every mounted toggle re-renders
 * together when any one of them flips the mode.
 */
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
};

const getSnapshot = (): ColorMode =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/** SSR has no DOM to read; light is the `:root` default. */
const getServerSnapshot = (): ColorMode => 'light';

const noopSubscribe = () => () => {};

export interface UseColorModeResult {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  /**
   * False on the server and during hydration. Gate any icon or label that
   * differs between themes on this, otherwise SSR emits the light variant and
   * React complains when the dark one hydrates over it.
   */
  mounted: boolean;
}

const useColorMode = (): UseColorModeResult => {
  const colorMode = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const setColorMode = useCallback((next: ColorMode) => {
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — the mode still applies for this
      // session, it just won't survive a reload.
    }
  }, []);

  const toggleColorMode = useCallback(
    () => setColorMode(getSnapshot() === 'dark' ? 'light' : 'dark'),
    [setColorMode],
  );

  return { colorMode, setColorMode, toggleColorMode, mounted };
};

export default useColorMode;

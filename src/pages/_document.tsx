import { Html, Head, Main, NextScript } from 'next/document';
import { solvoThemeCss } from '@/shared/constants/solvo-theme';

/**
 * Resolves the color mode before the first paint. Without this the page
 * renders light, then snaps to dark once React hydrates — a visible flash on
 * every load for dark-mode users. Kept as a compact IIFE because it is
 * injected inline and blocks paint.
 */
const COLOR_MODE_SCRIPT = `
(function () {
  try {
    var m = localStorage.getItem('solvo:color-mode');
    if (m !== 'light' && m !== 'dark') {
      m = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = m;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: solvoThemeCss }} />
      </Head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: COLOR_MODE_SCRIPT }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

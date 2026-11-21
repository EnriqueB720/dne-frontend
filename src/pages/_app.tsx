import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useMemo } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import AuthProvider from '@/shared/contexts/auth.provider'
import NextAuthBridge from '@/shared/contexts/nextauth-bridge'
import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from "@apollo/client/react";
import { setApolloClient } from '@/shared/services/apollo.client';
import { I18nBoot } from '@/shared/i18n';


/**
 * Every entity in this API is keyed by `<entity>Id`, not the `id` field
 * Apollo looks for by default. Without these, nothing normalizes: a
 * mutation result lands in its own cache entry and the query that rendered
 * the same record keeps serving pre-mutation data — which is how the
 * provider settings form ended up re-displaying stale values right after a
 * successful save.
 */
const cacheTypePolicies = {
  User: { keyFields: ['userId'] as const },
  Supplier: { keyFields: ['supplierId'] as const },
  Service: { keyFields: ['serviceId'] as const },
  MediaAsset: { keyFields: ['mediaAssetId'] as const },
  Category: { keyFields: ['categoryId'] as const },
  // Search results are a wrapper with no id — never normalize them.
  SupplierSearchResult: { keyFields: false as const },
};

const createCache = () => new InMemoryCache({ typePolicies: cacheTypePolicies });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

// NEXT_PUBLIC_API_URL is the backend's base origin (e.g.
// "https://api.solvocr.com"), no path suffix — matching the convention
// every other call site in this codebase already uses (provider/settings,
// providers/[id], refineFooter, [...nextauth]). Falls back to the local
// backend for dev.
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
const HTTP_URI = `${API_BASE}/graphql`;

  // Memo'd so the client isn't re-created on every render.
  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri: HTTP_URI });

    // Attach the JWT from localStorage to every HTTP request.
    // Read inside setContext so we always pick up the freshest token
    // after login / refresh — not the one at module load time.
    const authLink = setContext((_, { headers }) => {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('@token') : null;
      return {
        headers: {
          ...headers,
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
      };
    });

    return new ApolloClient({ link: from([authLink, httpLink]), cache: createCache() });
  }, []);

  setApolloClient(client);

  return <ChakraProvider value={defaultSystem}>
      <Head>
        <title>Solvo</title>
        <meta name="description" content="Solvo: encuentre proveedores y servicios en su provincia y contáctelos directo." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/brand/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/assets/brand/logo-192.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        {/*
          Two theme-color entries so the mobile browser chrome tracks the
          canvas in both modes instead of staying stuck on the light value.
        */}
        <meta name="theme-color" content="#F4F5F7" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0B0B16" media="(prefers-color-scheme: dark)" />
        <style>{`
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: var(--solvo-bg);
            color: var(--solvo-text);
            transition: background-color 0.2s ease, color 0.2s ease;
          }
          /*
            Legacy class name from the pre-rebrand Fraunces pairing. It now
            resolves to the Plus Jakarta Sans display face so existing markup
            picks up the new brand type without a sweep.
          */
          .font-serif {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            letter-spacing: -0.02em;
          }
        `}</style>
      </Head>
      <SessionProvider session={session}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <I18nBoot />
            <NextAuthBridge />
            <Component {...pageProps} />
          </AuthProvider>
        </ApolloProvider>
      </SessionProvider>
    </ChakraProvider>

}

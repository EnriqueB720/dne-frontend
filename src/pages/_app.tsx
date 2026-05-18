import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useMemo } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import AuthProvider from '@/shared/contexts/auth.provider'
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { ApolloProvider } from "@apollo/client/react";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import 'react-international-phone/style.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const HTTP_URI = 'http://localhost:5000/graphql';
const WS_URI = 'ws://localhost:5000/graphql';

export default function App({ Component, pageProps }: AppProps) {
  // Memo'd so the client doesn't get re-created on every render. The WebSocket
  // link is only built on the browser — SSR/Node can't open a WS connection.
  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri: HTTP_URI });

    if (typeof window === 'undefined') {
      return new ApolloClient({ link: httpLink, cache: new InMemoryCache() });
    }

    const wsLink = new GraphQLWsLink(
      createClient({
        url: WS_URI,
        // Auto-reconnect on transient disconnects (tab sleep, network blips).
        retryAttempts: Infinity,
        shouldRetry: () => true,
      }),
    );

    // Subscriptions go over WS, queries and mutations stay on HTTP.
    const link = split(
      ({ query }) => {
        const def = getMainDefinition(query);
        return (
          def.kind === 'OperationDefinition' &&
          def.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    );

    return new ApolloClient({ link, cache: new InMemoryCache() });
  }, []);

  return <ChakraProvider value={defaultSystem}>
      <Head>
        <title>Solvo</title>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #FAFAF9;
            color: #1C1917;
          }
          .font-serif {
            font-family: 'Fraunces', Georgia, serif;
            font-optical-sizing: auto;
          }
        `}</style>
      </Head>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    </ChakraProvider>

}

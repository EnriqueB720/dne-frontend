import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import AuthProvider from '@/shared/contexts/auth.provider'
import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from "@apollo/client/react";
import { setApolloClient } from '@/shared/services/apollo.client';
import 'react-international-phone/style.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';


// Build the Apollo client once at module load (NOT inside the component body)
// — otherwise the client is recreated on every render, blowing the cache and
// re-initialising the in-memory chat service reference each time React paints.
const httpLink = new HttpLink({ uri: "http://localhost:5000/graphql" });

// Attach the JWT from localStorage to every GraphQL request. We read the
// token inside `setContext` (rather than once at module load) so the link
// always picks up the freshest token after login/refresh.
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

const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

// Expose the client to the service layer (conversation.service, ai.service),
// which uses raw client.query / client.mutate so it can be called from
// non-React paths (jotai atoms, async effects, etc.).
setApolloClient(apolloClient);


export default function App({ Component, pageProps }: AppProps) {
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
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    </ChakraProvider>

}

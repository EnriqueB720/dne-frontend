import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import AuthProvider from '@/shared/contexts/auth.provider'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from "@apollo/client/react";
import 'react-international-phone/style.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';


export default function App({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    link: new HttpLink({ uri: "http://localhost:5000/graphql" }),
    cache: new InMemoryCache(),
  });

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

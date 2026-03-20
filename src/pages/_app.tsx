import type { AppProps } from 'next/app'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import AuthProvider from '@/shared/contexts/auth.provider'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from "@apollo/client/react";


export default function App({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    link: new HttpLink({ uri: "http://localhost:8080/graphql" }),
    cache: new InMemoryCache(),
  });

  return <ChakraProvider value={defaultSystem}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    </ChakraProvider>

}
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

/**
 * Module-level holder for the app's ApolloClient.
 *
 * Most components use `useApolloClient()` from the React tree, but several
 * services (conversation.service, ai.service) call `client.query` /
 * `client.mutate` directly from non-React code paths — jotai atoms, async
 * effects, plain functions. They get the client through here.
 *
 * `_app.tsx` constructs the client once and calls `setApolloClient` before
 * anything renders.
 */
let _client: ApolloClient<NormalizedCacheObject> | null = null;

export function setApolloClient(
  client: ApolloClient<NormalizedCacheObject>,
): void {
  _client = client;
}

export function getApolloClient(): ApolloClient<NormalizedCacheObject> {
  if (!_client) {
    throw new Error(
      'Apollo client not initialised. Call setApolloClient(client) once ' +
        'after constructing the ApolloClient (see pages/_app.tsx).',
    );
  }
  return _client;
}

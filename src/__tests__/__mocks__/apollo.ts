// Stub — pure-logic tests don't need Apollo
export const gql = (s: TemplateStringsArray) => s.join('');
export const ApolloClient = class {};
export const InMemoryCache = class {};
export const HttpLink = class {};
export const from = (...args: any[]) => args;
export const split = (...args: any[]) => args;
export const setContext = (fn: any) => fn;
export const ApolloProvider = () => null;
export const useQuery = () => ({});
export const useLazyQuery = () => [() => {}, {}];
export const useMutation = () => [() => {}, {}];
export const useApolloClient = () => ({});

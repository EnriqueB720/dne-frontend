import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

/**
 * NextAuth here is only the OAuth *broker*. It runs the Google/GitHub handshake,
 * then hands the resulting provider token to our NestJS backend, which verifies
 * it, find-or-creates the user, and returns the app's own JWT — the single token
 * every GraphQL guard validates. We stash that backend JWT (and the user) on the
 * NextAuth session so the frontend can bridge it into the existing auth flow.
 */

const BACKEND_GRAPHQL =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/graphql';

const SOCIAL_LOGIN_MUTATION = `
  mutation socialLogin($data: SocialLoginInput!) {
    socialLogin(data: $data) {
      access_token
      expiresAt
      user {
        userId
        email
        name
        isCustomer
        isSupplier
      }
    }
  }
`;

async function backendSocialLogin(provider: string, token: string) {
  let res: Response;
  try {
    res = await fetch(BACKEND_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: SOCIAL_LOGIN_MUTATION,
        variables: { data: { provider, token } },
      }),
    });
  } catch (e) {
    throw new Error(
      `Could not reach backend at ${BACKEND_GRAPHQL}: ${(e as Error).message}`,
    );
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  return json.data.socialLogin as {
    access_token: string;
    user: { isCustomer: boolean; isSupplier: boolean };
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // `account` is only populated on the very first call, right after the
    // provider redirect — that's when we exchange the provider token for ours.
    async jwt({ token, account }) {
      if (account) {
        try {
          const providerToken =
            account.provider === 'google'
              ? account.id_token
              : account.access_token;

          if (!providerToken) {
            throw new Error(
              `No ${account.provider} token on the OAuth account ` +
                `(got keys: ${Object.keys(account).join(', ')})`,
            );
          }

          const result = await backendSocialLogin(
            account.provider,
            providerToken as string,
          );

          token.backendToken = result.access_token;
          token.needsOnboarding =
            !result.user.isCustomer && !result.user.isSupplier;
          token.error = undefined;
        } catch (e) {
          // Surfaces in the `npm run dev` (frontend) terminal — not the browser.
          console.error('[NextAuth] socialLogin exchange failed:', e);
          token.error = (e as Error).message;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.backendToken = token.backendToken as string | undefined;
      session.needsOnboarding = token.needsOnboarding as boolean | undefined;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

export default NextAuth(authOptions);

import { FC, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

import AuthContext from './auth.context';
import { StorageService } from '@services';

/**
 * `iat` (issued-at, seconds) from a JWT, or 0 when there is no readable
 * token. Read-only: the signature is the API's job, this only orders tokens.
 */
function issuedAt(token: string | null | undefined): number {
  if (!token) return 0;
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return Number(JSON.parse(atob(payload)).iat) || 0;
  } catch {
    return 0;
  }
}

/**
 * Bridges a NextAuth (social login) session into the app's existing auth flow.
 *
 * We read the session with `getSession()` (a direct fetch to /api/auth/session)
 * rather than the `useSession()` hook, because next-auth v4's React client does
 * not reliably deliver the session under React 19 — but the endpoint itself is
 * fine. Once we have the backend JWT we drop it into localStorage['@token'] and
 * hydrate the user via the existing `refreshUserToken()`, so Apollo, the
 * AuthProvider and every page keep working unchanged.
 *
 * Brand-new social users have no role yet; once their profile loads and is still
 * role-less, we send them to /complete-profile. Password-login users have no
 * NextAuth session, so this component is inert for them.
 */
const NextAuthBridge: FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, refreshUserToken } = useContext(AuthContext);
  const [hasSocialSession, setHasSocialSession] = useState(false);
  const bridged = useRef(false);

  // 1) On mount, pull the NextAuth session and apply the backend token.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const session = await getSession();
      if (cancelled || !session) return;

      if (session.error) {
        console.error('[social login] backend exchange failed:', session.error);
        return;
      }
      if (!session.backendToken) return;

      setHasSocialSession(true);

      if (!bridged.current) {
        bridged.current = true;
        // The NextAuth cookie outlives our one-hour token and keeps handing
        // back the token minted at social sign-in. Only adopt it when it is
        // newer than what we hold — otherwise every reload would swap a
        // freshly renewed token for an expired one and sign the user out.
        const current = await StorageService.getJwtToken();
        if (issuedAt(session.backendToken) > issuedAt(current)) {
          await StorageService.setJwtToken(session.backendToken);
          await refreshUserToken();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshUserToken]);

  // 2) Route role-less social users into onboarding once their profile loads.
  useEffect(() => {
    if (!hasSocialSession || !isAuthenticated || !user) return;
    if (user.isCustomer || user.isSupplier) return; // already onboarded

    if (router.pathname !== '/complete-profile') {
      router.replace('/complete-profile');
    }
  }, [hasSocialSession, isAuthenticated, user, router]);

  return null;
};

export default NextAuthBridge;

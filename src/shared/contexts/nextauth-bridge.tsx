import { FC, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

import AuthContext from './auth.context';
import { StorageService } from '@services';

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
        await StorageService.setJwtToken(session.backendToken);
        await refreshUserToken();
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

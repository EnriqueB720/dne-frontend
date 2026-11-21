import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { signOut } from 'next-auth/react';

import AuthContext from './auth.context';

import { AuthCredentials, User, SignUpUser} from '@model';
import { AuthService } from '@services';
import { AuthProviderProps } from '@types';
import { useLoginLazyQuery, useSignupMutation, useRefreshUserLazyQuery } from '@generated';
import { StorageService } from '@services';
import { mergeGuestData } from '@/shared/services/conversation.service';

/** Well inside the API's one-hour token lifetime. */
const TOKEN_RENEW_INTERVAL_MS = 15 * 60 * 1000;


const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const client = useApolloClient();

  const [user, setUser] = useState<User>();

  const [loginQuery] = useLoginLazyQuery({
    fetchPolicy: 'cache-and-network'
  });

  // Never from cache: every call must mint a new token.
  const [refreshUser] = useRefreshUserLazyQuery({
    fetchPolicy: 'network-only'
  })

  const [signupQuery] = useSignupMutation();


  useEffect(() => {

    const refreshUserTokenAsync = async () => {
      await refreshUserToken();
    }

    refreshUserTokenAsync();

  }, []);

  const login = useCallback(async ({ credentials }: AuthCredentials): Promise<boolean> => {
    try {
      const { email, password } = credentials;

      setIsLoading(true);

      let { data, error } = await loginQuery({
        variables: {
          data: {
            email,
            password
          }
        }
      });

      if (error) {
        setIsLoading(false);
        return false;
      }


      StorageService.setJwtToken(data?.login!.access_token!);

      const user = new User(data?.login!.user! as any);
      setUser(user);

      setIsAuthenticated(true);

      // Best-effort: claim any chats the user started as a guest on this
      // device. Non-blocking — login succeeds even if this fails.
      mergeGuestData().catch(() => {});

      return true;

    } catch (error: any) {
      setIsLoading(false);
      return false;
    }
  }, [loginQuery, setIsLoading, setIsAuthenticated, setUser]);

  const register = useCallback(async ({ data }: SignUpUser) => {
    try {
      setIsLoading(true);

      let result = await signupQuery({
        variables: {
          data
        }
      });

      if (result.errors) {
        console.log(result.errors);
      }else{
        setIsLoading(false);
      }

    } catch (error: any) {
      setIsLoading(false);
    }
  }, [signupQuery, setIsLoading]);

  const logout = async () => {
    try {
      setIsLoading(true);

      await client.clearStore();
      await AuthService.logout();
      // Also tear down any NextAuth (social) session. No-op for password users.
      await signOut({ redirect: false }).catch(() => {});

      setIsAuthenticated(false);
      setUser(undefined);
    } catch (error) { }

    setIsLoading(false);
  };

  // Guest chats only need claiming once per page load, not on every renewal.
  const guestChatsMerged = useRef(false);

  const refreshUserToken = useCallback(async () => {
    try {

      let token = await StorageService.getJwtToken();
      if (!token) return;

      let { data, error } = await refreshUser({
        variables: {
          data: token
        }
      });

      // A network blip isn't a verdict on the session — keep the current
      // state and let the next renewal try again.
      if (error?.networkError && !data) return;

      // An expired or invalid token comes back as a GraphQL error (the API
      // returns null for a non-null field), so anything but a token here
      // means the session is over.
      const refreshed = data?.refreshUser;
      if (refreshed) {
        StorageService.setJwtToken(refreshed.access_token!);

        const user = new User(refreshed.user as any);
        setUser(user);

        setIsAuthenticated(true);

        // Also claim guest chats on refresh — covers the case where the
        // user authenticated in another tab or restored a session via
        // localStorage without going through the login flow.
        if (!guestChatsMerged.current) {
          guestChatsMerged.current = true;
          mergeGuestData().catch(() => {});
        }
      } else {
        await StorageService.removeJwtToken();
        setIsAuthenticated(false);
        setUser(undefined);
      }

    } catch (error: any) {
      console.log(error.message)
    }
  }, [refreshUser, setIsAuthenticated, setUser]);

  // Tokens live one hour, so renew them while the app is open: every few
  // minutes, plus right away when a backgrounded tab comes back (browsers
  // throttle timers in hidden tabs). Only an hour of no use signs you out.
  useEffect(() => {
    if (!isAuthenticated) return;

    const timer = setInterval(() => {
      refreshUserToken();
    }, TOKEN_RENEW_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshUserToken();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [isAuthenticated, refreshUserToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUserToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
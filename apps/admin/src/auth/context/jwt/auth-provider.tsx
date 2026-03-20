'use client';

import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import { useLingLogin } from 'src/auth/hooks/use-line-login';
import { useAuthentikLogin } from 'src/auth/hooks/use-authentik-login';
import { useGetUserProfile } from 'src/auth/hooks/use-get-user-profile';

import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const lineLogin = useLingLogin();

  const authentikLoginMutation = useAuthentikLogin();

  const getUserProfile = useGetUserProfile();

  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  // ----------------------------------------------------------------------

  const login = useCallback(
    async (authorizationCode: string) => {
      try {
        const { credentials, user } = await lineLogin.mutateAsync(authorizationCode);

        await setSession(credentials.accessToken, credentials.refreshToken);
        setState({ user });
      } catch (error) {
        console.log(error);
      }
    },
    [lineLogin, setState]
  );

  const loginWithAuthentik = useCallback(
    async (authorizationCode: string) => {
      try {
        const { credentials, user } = await authentikLoginMutation.mutateAsync(authorizationCode);

        await setSession(credentials.accessToken, credentials.refreshToken);
        setState({ user });
      } catch (error) {
        console.log(error);
      }
    },
    [authentikLoginMutation, setState]
  );

  // ----------------------------------------------------------------------

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const user = await getUserProfile.mutateAsync();

        setState({ user: { ...user.data, accessToken }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [getUserProfile, setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.roles?.TEC ?? 'MANAGER',
          }
        : null,
      checkUserSession,
      login,
      loginWithAuthentik,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, login, loginWithAuthentik, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

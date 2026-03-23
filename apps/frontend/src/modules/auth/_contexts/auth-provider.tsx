'use client';

import type { AuthState } from '../_types/auth.type';

import { toast } from 'src/shared/components/snackbar';
import { useSetState } from 'src/shared/hooks/use-set-state';
import { useMemo, useEffect, useCallback, type PropsWithChildren } from 'react';

import { AuthContext } from './auth-context';
import { useLingLogin } from '../_hooks/use-line-login';
import { STORAGE_KEY } from '../_constants/auth.constant';
import { getUserProfile } from '../_services/auth.service';
import { setSession, isValidToken } from '../_utils/auth.utils';

// ----------------------------------------------------------------------

export default function AuthProvider({ children }: PropsWithChildren) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  const { mutateAsync: lineLogin } = useLingLogin();

  // ----------------------------------------------------------------------

  const login = useCallback(async (authorizationCode: string) => {
    try {
      const { credentials, user } = await lineLogin(authorizationCode);

      await setSession(credentials.accessToken, credentials.refreshToken);
      setState({ user });
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const logout = useCallback(async (): Promise<void> => {
    try {
      await setSession(null);
      setState({ user: null, loading: false });
      toast.success('ออกจากระบบสำเร็จ');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const user = await getUserProfile();

        setState({ user: { ...user }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            roles: state.user?.roles ?? ['admin'],
          }
        : null,
      checkUserSession,
      login,
      logout,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [state.user, checkUserSession, login, logout, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

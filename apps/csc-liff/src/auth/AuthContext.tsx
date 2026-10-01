import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useRouter } from 'next/router';

import { LatLngTuple } from 'leaflet';

import { AuthenResponseType, ProfileType } from './types';
import { setSession } from './utils';

import {
  ErrorScreen,
  LocationLoadingScreen,
  LoadingScreen,
} from '@/components/loading';
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  LIFF_ID,
} from '@/config-global';
import axios from '@/utils/axios';

interface IAuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: ProfileType;
  tokenId: string | null;
  location: LatLngTuple | null;
}

interface IAuthContext extends IAuthState {
  login: (lineId: string) => Promise<void>;
  setProfile: (user: ProfileType) => Promise<void>;
}

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  SET_PROFILE = 'SET_PROFILE',
  SET_LOCATION = 'SET_LOCATION',
}

type ActionsType =
  | {
      type: Types.INITIAL;
      payload: {
        isAuthenticated: boolean;
        user: ProfileType;
        tokenId: string | null;
      };
    }
  | {
      type: Types.LOGIN;
      payload: {
        user: ProfileType;
      };
    }
  | {
      type: Types.SET_PROFILE;
      payload: {
        user: ProfileType;
      };
    }
  | {
      type: Types.SET_LOCATION;
      payload: {
        location: LatLngTuple;
      };
    };

const initialState: IAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  tokenId: null,
  location: null,
};

const reducer = (state: IAuthState, action: ActionsType) => {
  switch (action.type) {
    case Types.INITIAL:
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        tokenId: action.payload.tokenId,
      };
    case Types.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case Types.SET_PROFILE:
      return {
        ...state,
        user: action.payload.user,
      };
    case Types.SET_LOCATION:
      return {
        ...state,
        location: action.payload.location,
      };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<IAuthContext | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState(false);

  const router = useRouter();

  const initialize = useCallback(async () => {
    try {
      // init liff
      const liff = (await import('@line/liff')).default;
      await liff.init({ liffId: LIFF_ID });

      // LIFF hands back its cached ID token even after it expires, and the
      // backend rejects that; log in again to get a fresh one
      const idToken = liff.getDecodedIDToken();
      if (!idToken?.exp || idToken.exp * 1000 <= Date.now()) {
        if (liff.isLoggedIn()) liff.logout();
        liff.login({ redirectUri: window.location.href });
        return;
      }

      const config = {
        route: '/auth/authenticate',
        tokenId: liff.getIDToken(),
      };

      // get tokenId from liff
      const tokenId = config.tokenId;

      // verify user has been authen
      const { data } = await axios.post<AuthenResponseType>(config.route, {
        tokenId,
      });

      const { credentials } = data;

      if (!credentials) {
        if (router.pathname !== '/auth/register') {
          router.push('/auth/register').then(() => {
            dispatch({
              type: Types.INITIAL,
              payload: {
                isAuthenticated: false,
                user: null,
                tokenId,
              },
            });
          });
        }
      } else {
        setSession(credentials.accessToken);
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user: credentials.profile,
            tokenId,
          },
        });
      }
    } catch (error) {
      console.error(error);
      // alert(JSON.stringify(error));
      setError(true);

      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
          tokenId: null,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const getGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          dispatch({
            type: Types.SET_LOCATION,
            payload: {
              location: [latitude, longitude],
            },
          });
        },
        (error) => {
          dispatch({
            type: Types.SET_LOCATION,
            payload: {
              location: [DEFAULT_LATITUDE, DEFAULT_LONGITUDE],
            },
          });
        }
      );
    }
  };

  useEffect(() => {
    getGeolocation();
  }, []);

  const login = async (lineId: string) => {
    // this api require accessToken, user-profile
    const { data } = await axios.post('/auth/authenticate', { lineId });
    const { accessToken, user } = data;

    setSession(accessToken);

    dispatch({
      type: Types.LOGIN,
      payload: { user },
    });
  };

  const setProfile = async (user: ProfileType) => {
    dispatch({
      type: Types.SET_PROFILE,
      payload: { user },
    });
  };

  if (error) return <ErrorScreen />;

  return (
    <AuthContext.Provider value={{ ...state, login, setProfile }}>
      {state.isInitialized ? (
        state.location ? (
          children
        ) : (
          <LocationLoadingScreen />
        )
      ) : (
        <LoadingScreen />
      )}
      {/* <LoadingScreen /> */}
    </AuthContext.Provider>
  );
}

// try {
//   const accessToken = localStorage.getItem('accessToken') || '';
//   const validToken = await isValidToken(accessToken);
//   if (accessToken && validToken) {
//     setSession(accessToken);
//     // this api require user profile
//     const { data } = await axios.get('get profile api');
//     const { user } = data;
//     dispatch({
//       type: Types.INITIAL,
//       payload: {
//         isAuthenticated: true,
//         user,
//       },
//     });
//   } else {
//     dispatch({
//       type: Types.INITIAL,
//       payload: {
//         isAuthenticated: false,
//         user: null,
//       },
//     });
//   }
// } catch (error) {
//   console.error(error);
//   dispatch({
//     type: Types.INITIAL,
//     payload: {
//       isAuthenticated: false,
//       user: null,
//     },
//   });
// }

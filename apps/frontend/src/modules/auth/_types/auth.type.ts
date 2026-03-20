import type { User } from 'src/shared/types/user.type';

// -------------------------------------------------------------

type UserType = User | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
  login: (authorizationCode: string) => Promise<void>;
  logout: () => Promise<void>;
};

// -------------------------------------------------------------

export type Credentials = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = {
  credentials: Credentials;
  user: User;
};

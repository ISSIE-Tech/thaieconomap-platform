import { UserRole } from '../../enums';

export interface IAuthentikPayload {
  accessToken: string;
}

export interface IAuthentikUserInfo {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  picture?: string;
  groups?: string[];
}

/** roles granted per service by the caller's OIDC groups */
export interface IServiceRoles {
  TEC?: UserRole;
  CSC?: UserRole;
}

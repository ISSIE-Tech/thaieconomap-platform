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

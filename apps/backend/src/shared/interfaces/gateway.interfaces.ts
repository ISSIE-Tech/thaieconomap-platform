import { IUser } from './user.interface';

interface IGateWayMetaData {
  code: string;
  message: string;
  display: string;
}

export interface IGateWayResponse<T> extends IGateWayMetaData {
  data: T;
}

export type IGateWayPrivilegeUserReponse = IUser;

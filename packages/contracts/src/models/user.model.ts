import { UserRole } from '../enums';

import { IBaseEntity } from './common.model';

export interface IUserRoles {
  TEC: UserRole;
  CSC: UserRole;
}

export interface IUser extends IBaseEntity {
  shortId: string;
  authId: string;
  email: string;
  name: string;
  displayName: string;
  profileImageUrl: string;
  roles: IUserRoles;
  districts: string[];
}

import { IFavoriteListResponse, IUserRoles } from '../../../models';

export interface UserResponseDto {
  _id: string;
  shortId: string;
  authId: string;
  email: string;
  name: string;
  displayName: string;
  profileImageUrl: string;
  roles: IUserRoles;
  districts: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FavoriteListResponseDto extends IFavoriteListResponse {}

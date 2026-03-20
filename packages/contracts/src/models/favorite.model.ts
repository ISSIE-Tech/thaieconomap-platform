import { FavoriteType } from '../enums';

import { IBaseEntity } from './common.model';

export interface IFavoriteTarget {
  _id: string;
  name: string;
  address: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFavoriteList {
  _id: number;
  targets: IFavoriteTarget[];
}

export interface IFavoriteTargetResponse {
  type: string;
  targets: IFavoriteTarget[];
}

export interface IFavoriteListResponse {
  commercials: Record<string, IFavoriteTargetResponse[]>;
  shares: IFavoriteTargetResponse[];
  pumpuangs: IFavoriteTargetResponse[];
}

export interface IFavorite extends IBaseEntity {
  userId: string;
  targetId: string;
  type: FavoriteType;
}

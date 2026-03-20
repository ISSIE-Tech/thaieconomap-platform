
import {
  IFavoriteList,
  IFavoriteListResponse,
  IFavoriteTarget,
  IUser as IUserContract,
  IUserRoles,
  SubmissionStatus,
} from '@thaieconomap/contracts';

import { CommercialDocument } from '../../modules/commercials/schemas';
import { DistrictDocument } from '../../modules/map/schemas';
import { PumpuangDocument } from '../../modules/pumpuangs/schemas';
import { ShareDocument } from '../../modules/shares/schemas';

export interface IUser extends Omit<IUserContract, 'districts'> {
  districts: DistrictDocument[];
}

export { IUserRoles, IFavoriteTarget, IFavoriteList, IFavoriteListResponse };

export interface IHistory {
  _id: string;
  name: string;
  createdAt: Date;
  submissionStatus?: SubmissionStatus;
  entityType: string;
}

export type FavoriteTarget = ShareDocument | CommercialDocument | PumpuangDocument;

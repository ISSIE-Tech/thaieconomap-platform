import { PumpuangStatus, SubmissionStatus } from '../enums';

import { IBaseEntity } from './common.model';
import { IDisplayOpening, IOpening } from './opening.model';

export interface IPendingPumpuang extends IBaseEntity {
  name: string;
  licensePlate: string;
  owner: string;
  color: string;
  phoneNumber: string;
  moreInfo: string;
  imageUrl: string;
  additionalImageUrl?: string[];
  submissionStatus: SubmissionStatus;
  submissionMessage: string;
  rejectedAutoDelete?: Date;
  rejectedCompletelyDeleteAt?: Date;
  opening: IOpening[];
  displayOpening: IDisplayOpening[];
  types: string[];
  createdBy?: string;
}

export interface IPumpuang extends IPendingPumpuang {
  approvedAt: Date;
  status: PumpuangStatus;
  approvedBy: string;
  lastModifiedAt: Date;
  lastModifiedBy: string;
  refreshToken?: string;
}

export interface IDeletedPumpuang extends IPumpuang {
  deletedBy: string;
  deletedAutoDelete: Date;
  completelyDeletedAt: Date;
}

export interface IPumpuangLocation {
  pumpuangId: string;
  history: { location: string; trackedAt: Date }[][];
  lastLocationSent: number;
  current: { location: string; direction: number };
  types: { _id: string; name: string }[];
}

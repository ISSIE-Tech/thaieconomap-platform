import { ShareStatus, SubmissionStatus } from '../enums';

import { IBaseEntity } from './common.model';
import { ILocation } from './location.model';

export interface IContact {
  name: string;
  phoneNumber: string;
  email: string;
}

export interface IAmountWithUnit {
  amount: number;
  unit: string;
}

export interface IShareRequest {
  user: string;
  status: SubmissionStatus;
}

export interface IPendingShare extends IBaseEntity {
  name: string;
  types: string[];
  location: ILocation;
  imageUrl: string;
  createdBy: string;
  address: string;
  district: string;
  detail: string;
  contact: IContact;
  amount: IAmountWithUnit;
  shipping: string;
  condition: string;
  moreDetail: string;
  submissionStatus: SubmissionStatus;
  submissionMessage: string;
  rejectedAutoDelete?: Date;
  rejectedCompletelyDeletedAt?: Date;
  additionalImageUrl?: string[];
}

export interface IShare extends IPendingShare {
  status: ShareStatus;
  requests: IShareRequest[];
  approvedAt: Date;
  approvedBy: string;
  lastModifiedAt: Date;
  lastModifiedBy: string;
}

export interface IDeletedShare extends IShare {
  deletedBy: string;
  deletedAutoDelete: Date;
  completelyDeletedAt: Date;
}

import { CommercialCategory, SubmissionStatus } from '../enums';

import { IBaseEntity } from './common.model';
import { IDisplayOpening, IOpening } from './opening.model';
import { ILocation } from './location.model';

export interface IPendingCommercial extends IBaseEntity {
  name: string;
  category: CommercialCategory;
  location: ILocation;
  imageUrl: string;
  opening: IOpening[];
  displayOpening: IDisplayOpening[];
  district: string;
  commercialOwner: string;
  phoneNumber: string;
  moreInfo: string;
  createdBy: string;
  submissionStatus: SubmissionStatus;
  submissionMessage: string;
  rejectedAutoDelete?: Date;
  rejectedCompletelyDeleteAt?: Date;
  additionalImageUrl?: string[];
  typeRefPath: string;
  types: string[];
}

export interface ICommercial extends IPendingCommercial {
  approvedAt: Date;
  approvedBy: string;
  lastModifiedAt: Date;
  lastModifiedBy: string;
}

export interface IDeletedCommercial extends ICommercial {
  deletedBy: string;
  deletedAutoDelete: Date;
  completelyDeletedAt: Date;
}

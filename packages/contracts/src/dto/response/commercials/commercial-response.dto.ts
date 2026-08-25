import { CommercialCategory, SubmissionStatus } from '../../../enums';
import { IDisplayOpening, ILocation, IOpening } from '../../../models';

export interface CommercialResponseDto {
  _id: string;
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
  additionalImageUrl?: string[];
  types: string[];
  typeRefPath: string;
  submissionStatus: SubmissionStatus;
  submissionMessage: string;
  approvedAt: Date;
  approvedBy: string;
  lastModifiedAt: Date;
  lastModifiedBy: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommercialTinyResponseDto {
  _id: string;
  name: string;
  category: CommercialCategory;
  location: ILocation;
  imageUrl: string;
  displayOpening: IDisplayOpening[];
  district: string;
  types: { _id: string; name: string }[];
  isFavorite?: boolean;
  // NOTE: only present on the single-commercial detail route (`GET /:commercialId/tiny`);
  // the marker-list route projects these away.
  commercialOwner?: string;
  phoneNumber?: string;
  moreInfo?: string;
  additionalImageUrl?: string[];
}

export interface PendingCommercialResponseDto {
  _id: string;
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
  additionalImageUrl?: string[];
  types: string[];
  submissionStatus: SubmissionStatus;
  submissionMessage: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeletedCommercialResponseDto extends CommercialResponseDto {
  deletedBy: string;
  deletedAutoDelete: Date;
  completelyDeletedAt: Date;
}

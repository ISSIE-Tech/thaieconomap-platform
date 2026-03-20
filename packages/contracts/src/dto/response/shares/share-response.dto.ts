import { ShareStatus, SubmissionStatus } from '../../../enums';
import { IAmountWithUnit, IContact, ILocation } from '../../../models';

export interface ShareResponseDto {
  _id: string;
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
  additionalImageUrl?: string[];
  status: ShareStatus;
  requests: { user: string; status: SubmissionStatus }[];
  submissionStatus: SubmissionStatus;
  submissionMessage: string;
  approvedAt: Date;
  approvedBy: string;
  lastModifiedAt: Date;
  lastModifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShareTinyResponseDto {
  _id: string;
  name: string;
  types: { _id: string; name: string }[];
  location: ILocation;
  imageUrl: string;
  address: string;
  district: string;
  amount: IAmountWithUnit;
  status: ShareStatus;
  isFavorite?: boolean;
}

export interface PendingShareResponseDto {
  _id: string;
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
  additionalImageUrl?: string[];
  submissionStatus: SubmissionStatus;
  submissionMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeletedShareResponseDto extends ShareResponseDto {
  deletedBy: string;
  deletedAutoDelete: Date;
  completelyDeletedAt: Date;
}

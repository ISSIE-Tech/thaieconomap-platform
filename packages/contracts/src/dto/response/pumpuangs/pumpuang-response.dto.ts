import { PumpuangStatus, SubmissionStatus } from '../../../enums';
import { IDisplayOpening, IOpening } from '../../../models';

export interface ProductTypeDto {
  _id: string;
  name: string;
}

export interface PumpuangResponseDto {
  _id: string;
  name: string;
  licensePlate: string;
  owner: string;
  color: string;
  phoneNumber: string;
  moreInfo: string;
  imageUrl: string;
  additionalImageUrl?: string[];
  opening: IOpening[];
  displayOpening: IDisplayOpening[];
  types: ProductTypeDto[];
  status: PumpuangStatus;
  submissionStatus: SubmissionStatus;
  submissionMessage: string;
  approvedAt: Date;
  approvedBy: string;
  lastModifiedAt: Date;
  lastModifiedBy: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PumpuangTinyResponseDto {
  _id: string;
  current: { location: string; direction: number; speed?: number };
}

export interface PumpuangRouteResponseDto {
  _id: string;
  current: { location: string; direction: number; speed?: number };
  types: string[];
  history: string[][];
}

export interface PendingPumpuangResponseDto {
  _id: string;
  name: string;
  licensePlate: string;
  owner: string;
  color: string;
  phoneNumber: string;
  moreInfo: string;
  imageUrl: string;
  additionalImageUrl?: string[];
  opening: IOpening[];
  displayOpening: IDisplayOpening[];
  types: ProductTypeDto[];
  submissionStatus: SubmissionStatus;
  submissionMessage: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeletedPumpuangResponseDto extends PumpuangResponseDto {
  deletedBy: string;
  deletedAutoDelete: Date;
  completelyDeletedAt: Date;
}

export interface PumpuangRequestOtpResponseDto {
  refno: string;
  expiredAt: Date;
}

export interface PumpuangLocationTrackingResponseDto {
  location: { latitude: number; longitude: number };
  status: PumpuangStatus;
}

export interface RequestSessionResponseDto {
  sessionId: string;
}

export interface PumpuangAuthResponseDto {
  credentials: { accessToken: string; refreshToken?: string };
  profile: PumpuangResponseDto;
}

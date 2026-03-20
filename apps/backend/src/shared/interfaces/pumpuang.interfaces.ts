import { PumpuangLocationDto } from '../../modules/pumpuangs/dto';
import {
  DeletedPumpuangDocument,
  PendingPumpuangDocument,
  PumpuangDocument,
} from '../../modules/pumpuangs/schemas';
import { PumpuangStatus } from '../enums';

import { ICredentials } from './token.interface';

export type IAllPumpuang = PumpuangDocument | PendingPumpuangDocument | DeletedPumpuangDocument;

export interface IPumpuangRequestOtpResponse {
  refno: string;
  expiredAt: Date;
}

export interface IPumpuangStatus {
  status: PumpuangStatus;
}

export interface IPumpuangLocationTrackingResponse {
  location: PumpuangLocationDto;
  status: PumpuangStatus;
}

interface ICurrentPumpuangLocation {
  location: string;
  direction: number;
}

export interface IGetTinyPumpuangResponse {
  _id: string;
  current: ICurrentPumpuangLocation;
}

export interface IGetPumpuangRouteResponse {
  _id: string;
  current: ICurrentPumpuangLocation;
  types: string[];
  history: string[][];
}

export interface IPumpuangHistory {
  location: string;
  trackedAt: Date;
}

export interface IRequestSessionResponse {
  sessionId: string;
}

export interface IPumpuangAuthResponse {
  credentials: ICredentials;
  profile: PumpuangDocument;
}

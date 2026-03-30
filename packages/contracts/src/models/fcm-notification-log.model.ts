import { IBaseEntity } from './common.model';

export enum FcmNotificationStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export interface IFcmNotificationLog extends IBaseEntity {
  sendTo: string;
  status: FcmNotificationStatus;
  reason: string;
  errorMessage: string | null;
}

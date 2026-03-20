import { AnnouncementStatus } from '../enums';

import { IBaseEntity } from './common.model';

export interface IAnnouncement extends IBaseEntity {
  name: string;
  pdfUrl: string;
  detail: string;
  districts: string[];
  subDistricts: string;
  startAt: Date;
  endAt: Date;
  announcer: string;
  phoneNumber: string;
  createdBy: string;
  expiredAutoDelete: Date;
  isAvailable?: boolean;
  status?: AnnouncementStatus;
}

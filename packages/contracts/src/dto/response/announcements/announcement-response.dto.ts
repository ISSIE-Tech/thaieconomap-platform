import { AnnouncementStatus } from '../../../enums';

export interface AnnouncementResponseDto {
  _id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

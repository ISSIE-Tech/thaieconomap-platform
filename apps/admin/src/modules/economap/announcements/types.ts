export type AnnouncementItem = {
  _id: string; // MongoDB ObjectId as a string
  name: string; // Name of the announcement
  pdfUrl: string; // URL of the PDF document
  detail: string; // Detail or description of the announcement
  districts: {
    _id: string; // MongoDB ObjectId for each district
    provinceName: string; // Name of the province
    districtName: string; // Name of the district
    districtType: string;
  }[]; // Array of districts
  subDistricts?: string;
  startAt: string; // ISO 8601 string representing the start date and time
  endAt: string; // ISO 8601 string representing the end date and time
  announcer: string; // Name of the announcer
  phoneNumber: string; // Phone number for the announcement
  createdBy: string; // User ID of who created the announcement
  expiredAutoDelete: string; // ISO 8601 string representing when the announcement will be auto-deleted if expired
  createdAt: string; // ISO 8601 string representing when the announcement was created
  updatedAt: string; // ISO 8601 string representing the last update time of the announcement
  isAvailable: boolean; // Availability status of the announcement
  status: ANNOUNCEMENT_STATUS;
};

export type AllAnnouncementItem = {
  // metaData: {};
  data: AnnouncementItem[];
};

export enum ANNOUNCEMENT_STATUS {
  PENDING = 'PENDING',
  ANNOUNCED = 'ANNOUNCED',
  EXPIRED = 'EXPIRED',
}

export const ANNOUNCEMENT_STATUS_TRANSLATIONS: Record<ANNOUNCEMENT_STATUS, string> = {
  [ANNOUNCEMENT_STATUS.PENDING]: 'ยังไม่มีผล',
  [ANNOUNCEMENT_STATUS.ANNOUNCED]: 'ยังมีผล',
  [ANNOUNCEMENT_STATUS.EXPIRED]: 'หมดอายุแล้ว',
};

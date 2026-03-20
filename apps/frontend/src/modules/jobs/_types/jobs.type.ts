import type { SubmissionStatus } from 'src/modules/form-history/_types/history.type';

export type JobTiny = {
  _id: string;
  // there's no name from fetched job, but I use it for LocationMarkers component
  name?: string;
  title: string;
  category: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  chialshareLink: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
};

export type JobType = {
  _id: string;
  name: string;
  iconUrl: string;
  isMain: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type JobPost = {
  _id: string;
  title: string;
  category: JobType;
  description: string;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  acceptanceStatus: 'AVAILABLE' | 'UNAVAILABLE';
  submissionStatus: SubmissionStatus;
  applicants: {
    number: number;
    submissions: unknown[]; // Replace `any` with a specific type if available.
  };
  wage: {
    amount: number;
    unit: string;
  };
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  closeDate: string; // ISO Date string
  workload: string;
  qualification: string;
  // NOTE: this imageUrl might not exist straight up!
  imageUrl?: string;
  imageUrls: string[];
  location: {
    address: {
      name: string;
      district: string; // Could be an ID as indicated by the example
    };
    longitude: string;
    latitude: string;
  };
  createdBy: {
    _id: string;
    lineId: string;
    name: string;
    phoneNumber: string;
  };
  deletedAt: string | null;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
};

export enum ThaiJobAcceptanceStatus {
  AVAILABLE = 'เปิดรับสมัคร',
  UNAVAILABLE = 'ไม่เปิดรับสมัคร',
}

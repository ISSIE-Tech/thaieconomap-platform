import { ProfileType } from '@/auth/types';

type PostStatusType = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AcceptanceStatusType = 'AVAILABLE' | 'ALMOST_FULL' | 'FULL';
export type SubmissionStatusType =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';

export type JobCategoryType = {
  _id: string;
  name: string;
  iconUrl: string;
  isMain: boolean;
  index?: number;
};

export type WageUnitType = {
  _id: string;
  name: string;
};

export type SubmissionType = {
  _id: string;
  additionalInformation: string;
  candidate: ProfileType;
  createdAt: string;
  jobPost: string;
  status: SubmissionStatusType;
  updatedAt: string;
};

export type PostType = {
  _id: string;
  title: string;
  category: JobCategoryType;
  description: string;
  status: 'AVAILABLE' | 'CLOSED';
  acceptanceStatus: AcceptanceStatusType;
  wage: {
    amount: string;
    unit: string;
  };
  workload: string;
  applicants: {
    number: string;
    submissions: SubmissionType[];
  };
  qualification: string;
  location: {
    latitude: string;
    longitude: string;
    address: {
      name: string;
      district: string;
    };
  };
  createdBy: {
    name: string;
    phoneNumber: string;
    experiences: string;
    birthDate: string;
  };
  startDate: string;
  endDate: string;
  closeDate: string;
  imageUrls: string[];
  createdAt: Date;
};

export type UserPostType = PostType & {
  submissionStatus: PostStatusType;
  rejectMessage?: string;
};

export type UserSubmissionType = {
  _id: string;
  additionalInformation: string;
  jobPost: PostType;
  status: SubmissionStatusType;
  createdAt: string;
  updatedAt: string;

  candidate: string;
};

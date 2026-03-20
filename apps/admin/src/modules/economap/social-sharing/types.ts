import type { UserRef } from '../commercial/types';
import type { ECONOMAP_STATUS } from '../_config/economap-status.config';

export type SocialSharingItem = {
  name: string;
  types: {
    _id: string;
    name: string;
  }[];
  location: {
    type: string;
    coordinates: [number, number];
  };
  imageUrl: string;
  createdBy?: UserRef;
  address: string;
  district: {
    _id: string;
    provinceName: string;
    districtType: string;
    districtName: string;
    latitude: number;
    longitude: number;
  };
  detail: string;
  contact: {
    name: string;
    phoneNumber: string;
  };
  amount: {
    amount: number;
    unit: string;
  };
  condition: {
    _id: string;
    name: string;
  };
  moreDetail: string;
  submissionStatus: ECONOMAP_STATUS;
  submissionMessage: string;
  additionalImageUrl: string[];
  status: string;
  _id: string;

  // timestamps
  createdAt?: string;
  updatedAt?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: UserRef;
  approvedBy?: UserRef;
};

export type SocialSharingTypes = {
  _id: string;
  name: string;
};

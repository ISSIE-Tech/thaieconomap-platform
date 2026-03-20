import type { ECONOMAP_STATUS } from '../_config/economap-status.config';
import type { COMMERCIAL_CATEGORY } from './_configs/commercial-category.config';

// ----------------------------------------------------------------------

export type UserRef = {
  _id: string;
  authId: string;
};

export type CommercialItem = {
  _id: string;
  name: string;
  category: COMMERCIAL_CATEGORY;
  submissionStatus: ECONOMAP_STATUS;
  imageUrl: string;
  phoneNumber: string;
  types: {
    _id: string;
    name: string;
  }[];
  location: {
    coordinates: [number, number];
  };
  opening: {
    day: string;
    enable: boolean;
    hours: Time[];
  }[];
  displayOpening: {
    days: string;
    time: Time[];
  }[];
  address: string;
  district: {
    _id: string;
    provinceName: string;
    districtType: string;
    districtName: string;
    latitude: number;
    longitude: number;
  };
  moreInfo: string;
  additionalImageUrl: string[];
  commercialOwner: string;

  // timestamps
  createdAt?: string;
  updatedAt?: string;
  createdBy?: UserRef;
  lastModifiedAt?: string;
  lastModifiedBy?: UserRef;
  approvedBy?: UserRef;

  // submissionStatus: rejected
  submissionMessage?: string;
};

// ----------------------------------------------------------------------

export type Time = {
  open: number;
  close: number;
};

// ----------------------------------------------------------------------

/*
  This type is used in the Economap commercial module to represent the commercial item.
  It is used in the Economap commercial module to represent the commercial item.
  It is used in the Economap commercial module to represent the commercial item.
*/

export type CommercialType = {
  _id: string;
  name: string;
};

export type PumpuangTiny = {
  _id: string;
  current: {
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
    direction: number;
  };
};

export type PumpuangDayHistory = PumpuangTiny & {
  history: PumpuangShortHistory[];
};

type PumpuangShortHistory = {
  type: string;
  coordinates: [number, number][];
};

export type Pumpuang = {
  _id: string;
  name: string;
  licensePlate: string;
  color: string;
  phoneNumber: string;
  moreInfo: string;
  imageUrl: string;
  additionalImageUrl: string[];
  createdBy: string;
  owner: string;
  submissionStatus: 'ACCEPTED' | 'PENDING' | 'REJECTED'; // Assuming possible statuses
  status: 'RUNNING' | 'INACTIVE';
  opening: {
    day: string; // e.g., "Sunday"
    enable: boolean;
    hours: {
      open: number; // in minutes from midnight
      close: number; // in minutes from midnight
    }[];
  }[];
  displayOpening: {
    days: string; // e.g., "วันอังคาร"
    time: {
      open: string; // e.g., "05.00"
      close: string; // e.g., "16.00"
    }[];
  }[];
  types: {
    _id: string;
    name: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  }[];
  approvedBy: string;
  lastModifiedBy: string;
  approvedAt: string;
  lastModifiedAt: string;
  refreshToken: string;
  isFavorite: boolean;
};

export type ProductTypes = {
  _id: string;
  name: string;
  createdBy: {
    _id: string;
    authId: string;
  };
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
};

export enum PumpuangWorkingStatus {
  RUNNING = 'วิ่งอยู่',
  INACTIVE = 'ไม่วิ่งอยู่',
}

// TODO: this filter probably doesn't need to exist
export const pumpuangFilter = {
  workingHour: {
    ANYTIME: 'เวลาใดก็ได้',
    OPEN: 'วิ่งอยู่',
    NEAR_OPEN: 'ใกล้จะวิ่ง',
  },
} as const;

export type PumpuangWorkingHourFilter = keyof typeof pumpuangFilter.workingHour;

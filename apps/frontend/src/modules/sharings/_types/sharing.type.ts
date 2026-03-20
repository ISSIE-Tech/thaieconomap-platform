export type SharingTiny = {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  imageUrl: string;
  address: string;
  district: {
    _id: string;
    provinceId: number;
    provinceName: string;
    districtId: number;
    districtName: string;
  };
  shipping: {
    _id: string;
    name: string;
  };
  condition: {
    _id: string;
    name: string;
  };
  approvedAt: string;
  types: Array<{
    _id: string;
    name: string;
  }>;
};

export type Sharing = SharingTiny & {
  createdBy: {
    _id: string;
    authId: string;
  };
  detail: string;
  contact: {
    name: string;
    phoneNumber: string;
    email: string;
  };
  amount: {
    amount: number;
    unit: string;
  };
  moreDetail: string;
  additionalImageUrl: string[];
  status: keyof typeof SharingStatus;
  updatedAt: string;
  createdAt: string;
  isFavorite: boolean;
};

export enum SharingStatus {
  OPEN = 'มีของอยู่',
  NEAR_FULL = 'ใกล้เต็ม',
  FULL = 'เต็มแล้ว',
}

// Filter
export const sharingFilter = {
  status: {
    OPEN: 'มีของอยู่',
    NEAR_FULL: 'ใกล้เต็ม',
    FULL: 'เต็มแล้ว',
  },
  location: {
    ANYWHERE: 'ตำแหน่งใดก็ได้',
    NEAR_ME: 'ใกล้ฉัน',
  },
} as const;

export const sharingFilterDefault = {
  status: 'OPEN',
  location: 'ANYWHERE',
} as const;

export type StatusFilter = keyof typeof sharingFilter.status;

export type LocationFilter = keyof typeof sharingFilter.location;

// when is sharing default?
// a) no query param
// b) status=OPEN&location=ANYWHERE
export const getIsSharingDefault = (
  status: StatusFilter | null,
  location: LocationFilter | null,
  district: string | null
) =>
  (sharingFilterDefault.status === status &&
    sharingFilterDefault.location === location &&
    !district) ||
  (!status && !location && !district);

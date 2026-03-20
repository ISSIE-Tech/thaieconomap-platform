export type CommercialTiny = {
  _id: string;
  name: string;
  category: keyof typeof CommercialCategory;
  location: {
    type: string;
    coordinates: [number, number];
  };
};

export type Commercial = {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  imageUrl: string;
  category: keyof typeof CommercialCategory;
  displayOpening: {
    days: string;
    time: {
      open: string;
      close: string;
    }[];
  }[];
  address: string;
  district: District;
  commercialOwner: string;
  phoneNumber: string;
  moreInfo: string;
  additionalImageUrl: string[];
  typeRefPath: string;
  types: CommercialType[];
  isNewlyOpened: boolean;
  workingStatus: keyof typeof CommercialWorkingStatus;
  base: {
    _id: string;
    name: string;
    botInfo: {
      basicId: string;
      displayName: string;
      pictureUrl: string;
    };
  };
  isFavorite: boolean;
};

export type CommercialSmallDetail = {
  displayOpening?: {
    days: string;
    time: {
      open: string;
      close: string;
    }[];
  }[]; // Used for opening times
  moreInfo?: string; // Additional information
  commercialOwner?: string; // Owner of the commercial
  additionalImageUrl?: string[]; // Additional image URLs
};

export type CommercialType = {
  _id: string;
  name: string;
  createdBy: {
    _id: string;
    authId: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type District = {
  _id: string;
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtType: string;
  districtName: string;
  latitude: number;
  longitude: number;
};

export type Province = {
  provinceId: string;
  provinceName: string;
};

export enum CommercialCategory {
  RESTAURANT = 'ร้านอาหาร',
  BUSINESS = 'ธุรกิจ',
}

export enum CommercialWorkingStatus {
  OPEN = 'เปิดอยู่',
  CLOSED = 'ปิดอยู่',
  NEAR_OPEN = 'ใกล้จะเปิด',
}

// Filter
export const commercialFilter = {
  workingHour: {
    ANYTIME: 'เวลาใดก็ได้',
    OPEN: 'เปิดอยู่',
    NEAR_OPEN: 'ใกล้จะเปิด',
  },
  location: {
    ANYWHERE: 'ตำแหน่งใดก็ได้',
    NEAR_ME: 'ใกล้ฉัน',
  },
} as const;

export const commercialFilterDefault = {
  workingHour: 'ANYTIME',
  location: 'ANYWHERE',
} as const;

export type WorkingHourFilter = keyof typeof commercialFilter.workingHour;

export type LocationFilter = keyof typeof commercialFilter.location;

export const getIsDefault = (
  workingHour: WorkingHourFilter,
  location: LocationFilter,
  types?: string
) =>
  workingHour === commercialFilterDefault.workingHour &&
  location === commercialFilterDefault.location &&
  (types === '' || !types);

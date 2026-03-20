enum ROLE {
  TEC = 'TEC',
  CSC = 'CSC',
}

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export type ManagerItem = {
  _id: string;
  authId: string;
  name: string;
  email: string;
  roles: {
    [ROLE.TEC]: string;
    [ROLE.CSC]: string;
  };
  phone: string;
  profileImageUrl: string;
  displayName: string;
  shortId: string;
  oauth?: {
    provider: string;
  };
  districts: {
    _id: string;
    provinceName: string;
    districtType: string;
    districtName: string;
    latitude: number;
    longitude: number;
  }[];
};

export type registerParams = {
  name: string;
  phone: string;
  role: string;
  districts: string[];
};

export type registerDistrictsParams = {
  districts: string[];
};

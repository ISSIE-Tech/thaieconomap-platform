export interface ITamsangTamsongMetaData {
  statusCode: string;
  count: number;
  currentPage: number;
  perPage: number;
  nextPage: number;
  prevPage: number;
  lastPage: number;
}

export interface ITamsangTamsongResponse<T> extends ITamsangTamsongMetaData {
  data: T[];
}

export interface ITamsangTamsongBaseShopResponse {
  name: string;
  id: string;
  botInfo: IBotInfo;
}

interface IBotInfo {
  basicId: string;
  displayName: string;
  pictureUrl: string;
}

export interface ITamsangTamsongShopResponse {
  location: IShopLocation;
  active: boolean;
  imgUrl: string;
  _id: string;
  base: string;
  name: string;
  type: string;
  opening: IShopOpening[];
  group: string;
  isOpen: boolean;
  openDay: string;
  time: IShopTime;
  id: string;
  profile: IShopProfile;
}

interface IShopOpening {
  enable: boolean;
  hours: IShopOpeningHour[];
  _id: string;
  day: string;
}

interface IShopOpeningHour {
  open: number;
  close: number;
}

interface IShopTime {
  open: string;
  close: string;
}

interface IShopLocation {
  address: string;
  latitude: number;
  longitude: number;
}

interface ILineProfile {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
}

interface IShopProfile {
  firstname: string;
  lastname: string;
  phone: string;
  description: string;
  picture: string;
  _id: string;
  lineProfile: ILineProfile;
}

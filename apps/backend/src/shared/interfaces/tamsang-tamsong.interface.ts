import { DayName, TamsangTamsongCommercialType } from '@thaieconomap/contracts';

export interface ITamsangTamsongPaginationMetaData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ITamsangTamsongResponse<T> extends ITamsangTamsongPaginationMetaData {
  items: T[];
}

export interface ITamsangTamsongShopResponse {
  id: string;
  name: string;
  type: TamsangTamsongCommercialType;
  baseId: string;
  /** Empty string when the owner never uploaded a photo. */
  imageUrl: string;
  locationAddress: string | null;
  latitude: number;
  longitude: number;
  ownerUser: IShopOwner;
  hours: IShopHours[];
}

interface IShopOwner {
  id: string;
  firstname: string;
  lastname: string;
  /** Null when the owner has no phone on file. Never a reason to drop the shop. */
  phone: string | null;
}

export interface IShopHours {
  day: TamsangTamsongDayName;
  enabled: boolean;
  /** Minutes since midnight, Asia/Bangkok. 08:00 => 480. */
  openTime: number;
  /** Minutes since midnight. 1440 is end of day. <= openTime means it closes the FOLLOWING day. */
  closeTime: number;
}

export type TamsangTamsongDayName = Lowercase<keyof typeof DayName>;

export interface ITamsangTamsongBaseShopResponse {
  id: string;
  name: string | null;
  signature: string;
  tamsangEnabled: boolean;
  tamsongPassengerEnabled: boolean;
  tamsongParcelEnabled: boolean;
  latitude: number | null;
  longitude: number | null;
  serviceRadiusKm: number;
  locationAddress: string | null;
  adminPhone: string | null;
  /** Null when the node has no tamsang_tamsong LINE channel configured yet. */
  botInfo: IBotInfo | null;
}

interface IBotInfo {
  basicId: string;
  displayName: string;
  lineImageUrl: string;
}

export enum CommercialType {
    'BUSINESS' = 'ธุรกิจ',
    'RESTAURANT' = 'ร้านอาหาร',
    'PUMPUANG' = 'พุ่มพวง',
  }
  
  export const CommercialTypeLabel: Record<CommercialType, string> = {
    [CommercialType.RESTAURANT]: 'RESTAURANT',
    [CommercialType.BUSINESS]: 'BUSINESS',
    [CommercialType.PUMPUANG]: 'PUMPUANG',
  };
  
  export type District = {
    districtId: number;
    districtName: string;
    districtType: string;
    latitude: number;
    longitude: number;
    provinceId: number;
    provinceName: string;
    _id: string;
  };
  
  export type FormattedDistricts = {
    value: number;
    districtLabel: string;
    provinceLabel: string;
  };
  
  export type CommercialOptions = {
    _id: string;
    name: string;
  };
  
  export type Opening = {
    enable: boolean;
    hours: Time[];
    day: string;
  };
  
  export type Time = {
    open: number;
    close: number;
  };
  
import { IBaseEntity } from './common.model';

export interface IDistrict extends IBaseEntity {
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtType: string;
  districtName: string;
  latitude: number;
  longitude: number;
}

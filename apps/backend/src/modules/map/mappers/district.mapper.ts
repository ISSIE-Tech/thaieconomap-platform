import { DistrictResponseDto } from '@thaieconomap/contracts';

import { DistrictDocument } from '../schemas';

export class DistrictMapper {
  static toResponseDto(doc: DistrictDocument): DistrictResponseDto {
    const obj = doc.toJSON ? doc.toJSON() : doc;

    return {
      _id: obj._id?.toString(),
      provinceId: obj.provinceId,
      provinceName: obj.provinceName,
      districtId: obj.districtId,
      districtType: obj.districtType,
      districtName: obj.districtName,
      latitude: obj.latitude,
      longitude: obj.longitude,
    };
  }
}

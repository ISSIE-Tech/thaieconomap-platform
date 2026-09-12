import { CommercialCategory, TamsangTamsongCommercialType } from '@thaieconomap/contracts';

import {
  IBase,
  IShop,
  ITamsangTamsongBaseShopResponse,
  ITamsangTamsongShopResponse,
} from '../../../shared/interfaces';
import {
  transformLatitudeAndLongitudeToGeoJson,
  transformOpeningToDisplayOpening,
  transformPhoneNumber,
} from '../../../shared/utils';

export class CachingMapper {
  private static categoryMap = new Map<string, string>([
    [TamsangTamsongCommercialType.RESTAURANT, CommercialCategory.RESTAURANT],
    [TamsangTamsongCommercialType.GROCERY, CommercialCategory.BUSINESS],
  ]);

  public static transformTamsangTamsongShopToShop(data: ITamsangTamsongShopResponse): IShop {
    return {
      _id: data.id,
      name: data.name,
      address: data.location.address,
      location: transformLatitudeAndLongitudeToGeoJson(data.location),
      imageUrl: data.imgUrl,
      opening: data.opening,
      displayOpening: transformOpeningToDisplayOpening(data.opening),
      phoneNumber: transformPhoneNumber(data.profile.phone),
      commercialOwner: `${data.profile.firstname} ${data.profile.lastname}`,
      type: data.type,
      base: data.base,
      category: this.categoryMap.get(data.group),
    };
  }

  public static transformTamsangTamsongBaseShopToBase(
    data: ITamsangTamsongBaseShopResponse,
  ): IBase {
    return {
      _id: data.id,
      name: data.name,
      botInfo: data.botInfo,
    };
  }
}

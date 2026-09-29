import { CommercialCategory, DayName, TamsangTamsongCommercialType } from '@thaieconomap/contracts';

import {
  IBase,
  IShop,
  IShopHours,
  ITamsangTamsongBaseShopResponse,
  ITamsangTamsongShopResponse,
  TamsangTamsongDayName,
} from '../../../shared/interfaces';
import {
  minutesSinceMidnightToTime,
  transformLatitudeAndLongitudeToGeoJson,
  transformPhoneNumber,
  transformUuidToObjectId,
  transfromDayNameFromEnglishToThai,
} from '../../../shared/utils';
import { ShopDisplayOpening, ShopOpening, ShopOpeningTime } from '../schemas';

const MINUTES_IN_DAY = 1440;
/**
 * The workingStatus aggregation reads `opening` by `new Date().getDay()`, so the array
 * has to stay sunday-first and hold all seven days. tamsang-tamsong returns the days
 * lowercased and in no guaranteed order.
 */
const DAYS_SUNDAY_FIRST: TamsangTamsongDayName[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const DAY_NAMES_SUNDAY_FIRST: DayName[] = [
  DayName.Sunday,
  DayName.Monday,
  DayName.Tuesday,
  DayName.Wednesday,
  DayName.Thursday,
  DayName.Friday,
  DayName.Saturday,
];

export class CachingMapper {
  private static categoryMap = new Map<string, CommercialCategory>([
    [TamsangTamsongCommercialType.RESTAURANT, CommercialCategory.RESTAURANT],
    [TamsangTamsongCommercialType.GROCERY, CommercialCategory.BUSINESS],
  ]);

  public static transformTamsangTamsongShopToShop(data: ITamsangTamsongShopResponse): IShop {
    return {
      _id: transformUuidToObjectId(data.id),
      sourceId: data.id,
      name: data.name,
      address: data.locationAddress ?? undefined,
      location: transformLatitudeAndLongitudeToGeoJson({
        latitude: data.latitude,
        longitude: data.longitude,
      }),
      imageUrl: data.imageUrl,
      opening: this.transformHoursToOpening(data.hours),
      displayOpening: this.transformHoursToDisplayOpening(data.hours),
      phoneNumber: transformPhoneNumber(data.ownerUser.phone),
      commercialOwner: `${data.ownerUser.firstname} ${data.ownerUser.lastname}`,
      type: data.type,
      base: transformUuidToObjectId(data.baseId),
      category: this.categoryMap.get(data.type),
    };
  }

  public static transformTamsangTamsongBaseShopToBase(
    data: ITamsangTamsongBaseShopResponse,
  ): IBase {
    return {
      _id: transformUuidToObjectId(data.id),
      sourceId: data.id,
      name: data.name ?? undefined,
      botInfo: data.botInfo ?? undefined,
    };
  }

  /**
   * Turns the upstream day windows into the sunday-first, seven-entry shape the
   * workingStatus aggregation expects. An overnight window (closeTime <= openTime,
   * e.g. 18:00-02:00) is cut at midnight and the remainder is carried onto the next
   * day, so "is it open right now" stays a plain within-the-window check.
   */
  private static transformHoursToOpening(hours: IShopHours[]): ShopOpening[] {
    const hoursByDay = new Map(hours.map(dayHours => [dayHours.day, dayHours]));

    return DAYS_SUNDAY_FIRST.map((day, index) => {
      const today = hoursByDay.get(day);
      const yesterday = hoursByDay.get(DAYS_SUNDAY_FIRST[(index + 6) % 7]);
      const openingHours: ShopOpeningTime[] = [];

      if (this.spillsIntoNextDay(yesterday)) {
        openingHours.push({ open: 0, close: yesterday.closeTime });
      }

      if (this.isOpenOnThatDay(today)) {
        openingHours.push({
          open: today.openTime,
          close: this.wrapsPastMidnight(today) ? MINUTES_IN_DAY : today.closeTime,
        });
      }

      return {
        day: DAY_NAMES_SUNDAY_FIRST[index],
        enable: openingHours.length > 0,
        hours: openingHours,
      };
    });
  }

  /**
   * What the customer reads. Unlike `opening` this keeps an overnight window whole,
   * so 18:00-02:00 shows as one line on the day it starts instead of two.
   */
  private static transformHoursToDisplayOpening(hours: IShopHours[]): ShopDisplayOpening[] {
    const hoursByDay = new Map(hours.map(dayHours => [dayHours.day, dayHours]));

    return DAYS_SUNDAY_FIRST.reduce<ShopDisplayOpening[]>((displayOpening, day, index) => {
      const dayHours = hoursByDay.get(day);

      if (this.isOpenOnThatDay(dayHours)) {
        displayOpening.push({
          days: transfromDayNameFromEnglishToThai(DAY_NAMES_SUNDAY_FIRST[index]),
          time: [
            {
              open: minutesSinceMidnightToTime(dayHours.openTime),
              close: minutesSinceMidnightToTime(dayHours.closeTime),
            },
          ],
        });
      }

      return displayOpening;
    }, []);
  }

  private static isOpenOnThatDay(dayHours: IShopHours | undefined): boolean {
    // openTime === closeTime carries no window either way, so it is not an opening
    return Boolean(dayHours?.enabled) && dayHours.openTime !== dayHours.closeTime;
  }

  // closeTime < openTime means the window closes on the following day, so today's
  // half of it runs to end of day
  private static wrapsPastMidnight(dayHours: IShopHours | undefined): boolean {
    return this.isOpenOnThatDay(dayHours) && dayHours.closeTime < dayHours.openTime;
  }

  // a window closing at exactly midnight leaves nothing to carry onto the next day
  private static spillsIntoNextDay(dayHours: IShopHours | undefined): boolean {
    return this.wrapsPastMidnight(dayHours) && dayHours.closeTime > 0;
  }
}

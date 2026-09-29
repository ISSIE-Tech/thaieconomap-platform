import { createHash } from 'crypto';

import { Types } from 'mongoose';

import { DAYS_IN_THAI } from '../constants';
import { LocationDto } from '../dto';
import { GeoJsonType } from '@thaieconomap/contracts';
import { Location } from '../schemas';

export function transfromDayNameFromEnglishToThai(day: string): string {
  return DAYS_IN_THAI[day];
}

export function getCurrentMiniutesPassSinceMidnight(now: Date): number {
  const midnight = new Date().setHours(0, 0, 0, 0); // set to midnight
  const millisecondsSinceMidnight = now.getTime() - midnight;

  return millisecondsSinceMidnight / 60000; // convert to minutes
}

export function transformPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return undefined;

  return phoneNumber.replace(/\D/g, '');
}

export function minutesSinceMidnightToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');

  const mins = (minutes % 60).toString().padStart(2, '0');

  return `${hours}.${mins}`; // output format: HH.mm
}

export function transformLatitudeAndLongitudeToGeoJson(location: LocationDto): Location {
  return {
    type: GeoJsonType.POINT,
    coordinates: [location.longitude, location.latitude],
  };
}

export function convertToGeoJsonPointFromCoordinates(location: string): Location {
  return {
    type: GeoJsonType.POINT,
    coordinates: location.split(',').map(Number),
  };
}

export function convertToGeoJsonLineStringFromCoordinates(
  histories: string[],
): Location & { startedAt?: string; endedAt?: string } {
  const parsed = histories.map((history: string) => JSON.parse(history));

  const coordinates = parsed.map(({ location }) => location.split(',').map(Number));

  const timestamps = parsed
    .map(({ trackedAt }) => trackedAt)
    .filter(Boolean);

  return {
    type: GeoJsonType.LINESTRING,
    coordinates,
    ...(timestamps.length > 0 && {
      startedAt: timestamps[0],
      endedAt: timestamps[timestamps.length - 1],
    }),
  };
}

export function convertBytesToMB(bytes: number): number {
  return bytes / 1048576; // 1MB = 1048576 bytes
}

/**
 * tamsang-tamsong identifies shops and nodes by uuid, while every id that travels
 * through this codebase (favorites.targetId, the shops/commercials $unionWith,
 * findShopsAndCommercialsById) is a mongo ObjectId. Hashing the uuid gives a stable
 * ObjectId for the same shop on every sync, so nothing downstream has to change.
 */
export function transformUuidToObjectId(uuid: string): Types.ObjectId {
  return new Types.ObjectId(createHash('sha256').update(uuid).digest('hex').slice(0, 24));
}

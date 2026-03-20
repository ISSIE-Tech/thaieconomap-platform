import { DAYS_IN_THAI } from '../constants';
import { LocationDto } from '../dto';
import { GeoJsonType } from '../enums';
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

export function transfromPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) {
    return undefined;
  }

  return phoneNumber.replace(/\D/g, '');
}

export function convertToGeoJsonPointFromCoordinates(location: string): Location {
  return {
    type: GeoJsonType.POINT,
    coordinates: location.split(',').map(Number),
  };
}

export function convertToGeoJsonLineStringFromCoordinates(histories: string[]): Location {
  const coordinates = histories.map((history: string) => {
    const { location } = JSON.parse(history);

    return location.split(',').map(Number);
  });

  return {
    type: GeoJsonType.LINESTRING,
    coordinates,
  };
}

export function convertBytesToMB(bytes: number): number {
  return bytes / 1048576; // 1MB = 1048576 bytes
}

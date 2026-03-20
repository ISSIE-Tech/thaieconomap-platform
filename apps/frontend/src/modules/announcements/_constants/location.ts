export const ANNOUNCEMENTS_FILTER_TYPES = {
  DISTRICT: 'district',
  PROVINCE_ID: 'provinceId',
  DATE: 'date',
} as const;

export type LocationType =
  | typeof ANNOUNCEMENTS_FILTER_TYPES.DISTRICT
  | typeof ANNOUNCEMENTS_FILTER_TYPES.PROVINCE_ID;

export const LOCATION_LENGTH = {
  // there will always be less than 100 province so provinceId should be lower than 2 digit, always
  PROVINCE_ID: 2,
  // mongo object id length
  DISTRICT: 24,
};

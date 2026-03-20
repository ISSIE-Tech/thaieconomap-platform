export const CONFIG = {
  MAXIMUM_FAVORITE: 10,
  MAX_INPUT_LENGTH: 100,
  MAX_TEXT_AREA_LENGTH: 250,
  MAX_OPENING_TIME: 23 * 60 + 59,
  MAX_DISTANCE_METERS: 5000, // unit: meters
  NEAR_OPEN_DURATION_MINUTES: 60, // unit: minutes
  NEWLY_OPENED_DURATION_MS: 604800000, // unit: milliseconds
  AUTO_DELETE_DURATION: '30d', // unit: days
  MAX_ADDITIONAL_IMAGE: 20, // unit: pictures
  MAX_UPLOADING_ADDITIONAL_IMAGE: 5, // unit: pictures/time
  MAX_COMMERCIALS_TYPE: 3,
  MAX_SHARE_TYPES: 3,
  MAX_PUMPUANG_TYPES: 3,
  REDIS_RECONECT_INTERVAL: 30 * 1000, // 30 sec unit: milliseconds
  DEFAULT_CACHE_TTL: 3 * 60 * 1000, // 3 min unit: milliseconds
  OTP_CACHE_TTL: 10 * 60 * 1000, // 10 min unit: milliseconds
  OTP_EXPIRE_AT: 5 * 60 * 1000, // 5 min unit: milliseconds
  // LOCATION_CACHE_TTL: 4 * 60 * 60, // 4 hours unit: seconds
  SESSION_CACHE_TTL: 24 * 60 * 60, // 1 day unit: seconds
  RESPONSE_CACHE_TTL: 60 * 60 * 1000, // 60 min unit: milliseconds
  LONG_TERM_REPONSE_CACHE_TTL: 24 * 60 * 60 * 1000, // 1 day unit: milliseconds
};

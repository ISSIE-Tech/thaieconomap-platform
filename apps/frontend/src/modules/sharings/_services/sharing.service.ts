import type { ApiResponse } from 'src/shared/types/api.type';

import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

import type { Sharing, SharingTiny } from '../_types/sharing.type';

type Params = {
  queryKey: string[];
};

// ----------------------------------------------------------------------

export const getTinySharings = async () => {
  const { data } = await axios.get<ApiResponse<SharingTiny[]>>(endpoints.shares.list);

  /*
   * Format the response from the API
   * - Coordinates from API are in [longitude, latitude] format 🤔
   */
  const formattedTinySharing = data.data.map(
    (tinySharing) =>
      ({
        ...tinySharing,
        location: {
          type: tinySharing.location.type,
          coordinates: [tinySharing.location.coordinates[1], tinySharing.location.coordinates[0]],
        },
      }) as SharingTiny
  );

  return formattedTinySharing;
};

// ----------------------------------------------------------------------

export const getTinyFilteredSharings = async ({ queryKey }: Params) => {
  // TODO: refactor filter
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, propKeys] = queryKey;

  // TODO: can probably just use & instead of , and add it as params, that would be way simplier
  // from: location:100,latitude:13,longitude:14,district:6612345 (string)
  /* to: 
  {
    location: 100,
    latitude: 13,
    longitude: 14,
    district: 6612345
  }
  */
  const params = propKeys.split(',').reduce(
    (acc, keyValue) => {
      const [key, value] = keyValue.split(':');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  const { data } = await axios.get<ApiResponse<SharingTiny[]>>(endpoints.shares.filter(params));

  /*
   * Format the response from the API
   * - Coordinates from API are in [longitude, latitude] format 🤔
   */
  const formattedTinySharing = data.data.map(
    (tinySharing) =>
      ({
        ...tinySharing,
        location: {
          type: tinySharing.location.type,
          coordinates: [tinySharing.location.coordinates[1], tinySharing.location.coordinates[0]],
        },
      }) as SharingTiny
  );

  return formattedTinySharing;
};

// ----------------------------------------------------------------------

export const getSharingById = async ({ queryKey }: Params) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, sharingId] = queryKey;

  // query data cannot be undefined
  if (sharingId === '') return null;

  const { data } = await axios.get<ApiResponse<Sharing>>(endpoints.shares.details(sharingId));

  return data.data;
};

// ----------------------------------------------------------------------

export const favoriteSharing = async (sharingId: string) => {
  const { data } = await axios.post(endpoints.shares.favorite(sharingId));

  return data.data;
};

// ----------------------------------------------------------------------

export const unfavoriteSharing = async (sharingId: string) => {
  const { data } = await axios.delete(endpoints.shares.unfavorite(sharingId));

  return data.data;
};

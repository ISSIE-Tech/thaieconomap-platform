import type { ApiResponse } from 'src/shared/types/api.type';
import type {
  District,
  Province,
  Commercial,
  CommercialTiny,
  CommercialType,
} from '../_types/commercials.type';

import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

type Params = {
  queryKey: string[];
};

// ----------------------------------------------------------------------

export const getTinyCommercials = async () => {
  const { data } = await axios.get<ApiResponse<CommercialTiny[]>>(endpoints.commercials.list);

  /*
   * Format the response from the API
   * - Coordinates from API are in [longitude, latitude] format 🤔
   */
  const formattedTinyCommercial = data.data.map(
    (tinyCommercial) =>
      ({
        ...tinyCommercial,
        location: {
          type: tinyCommercial.location.type,
          coordinates: [
            tinyCommercial.location.coordinates[1],
            tinyCommercial.location.coordinates[0],
          ],
        },
      }) as CommercialTiny
  );

  return formattedTinyCommercial;
};

// ----------------------------------------------------------------------

export const getCommercialById = async ({ queryKey }: Params) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, commercialId] = queryKey;

  // query data cannot be undefined
  if (commercialId === '') return null;

  const { data } = await axios.get<ApiResponse<Commercial>>(
    endpoints.commercials.details(commercialId)
  );

  return data.data;
};

// ----------------------------------------------------------------------

export const getRestaurantTypes = async () => {
  const { data } = await axios.get<ApiResponse<CommercialType[]>>(
    endpoints.commercials['restaurant-types']
  );

  return data.data;
};

// ----------------------------------------------------------------------

export const getBusinessTypes = async () => {
  const { data } = await axios.get<ApiResponse<CommercialType[]>>(
    endpoints.commercials['business-types']
  );

  return data.data;
};

// ----------------------------------------------------------------------

export const getDistricts = async () => {
  const { data } = await axios.get<ApiResponse<District[]>>(endpoints.district);

  return data.data;
};

// ----------------------------------------------------------------------

export const getProvinces = async () => {
  const { data } = await axios.get<ApiResponse<Province[]>>(endpoints.provinces);

  return data.data;
};

// ----------------------------------------------------------------------

export const getTinyFilteredCommercials = async ({ queryKey }: Params) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, category, propKeys] = queryKey;

  const params = `?category=${category}&${propKeys}`;
  const { data } = await axios.get<ApiResponse<CommercialTiny[]>>(
    endpoints.commercials.filter(params)
  );

  /*
   * Format the response from the API
   * - Coordinates from API are in [longitude, latitude] format 🤔
   */
  const formattedTinyCommercial = data.data.map(
    (tinyCommercial) =>
      ({
        ...tinyCommercial,
        location: {
          type: tinyCommercial.location.type,
          coordinates: [
            tinyCommercial.location.coordinates[1],
            tinyCommercial.location.coordinates[0],
          ],
        },
      }) as CommercialTiny
  );

  return formattedTinyCommercial;
};

// ----------------------------------------------------------------------

export const favoriteCommercial = async (commercialId: string) => {
  const { data } = await axios.post(endpoints.commercials.favorite(commercialId));

  return data.data;
};

// ----------------------------------------------------------------------

export const unfavoriteCommercial = async (commercialId: string) => {
  const { data } = await axios.delete(endpoints.commercials.unfavorite(commercialId));

  return data.data;
};

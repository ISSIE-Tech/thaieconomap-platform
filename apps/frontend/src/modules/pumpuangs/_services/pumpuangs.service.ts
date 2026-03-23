import type { ApiResponse } from 'src/shared/types/api.type';
import type {
  Pumpuang,
  ProductTypes,
  PumpuangTiny,
  PumpuangDayHistory,
} from '../_types/pumpuangs.type';

import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

type Params = {
  queryKey: string[];
};

// ----------------------------------------------------------------------

// this shouldn't be done on the frontend?
const transformCoordinates = ([lng, lat]: [number, number]) => [lat, lng] as [number, number];

export const getTinyPumpuangs = async ({ queryKey }: Params) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, propKeys] = queryKey;

  const { data } = await axios.get<ApiResponse<PumpuangTiny[]>>(
    endpoints.commercials.pumpuang.filter(`?${propKeys}`)
  );

  /*
   * Format the response from the API
   * - Coordinates from API are in [longitude, latitude] format 🤔
   */
  const formattedTinyPumpuang = data.data.map((tinyPumpuang) => ({
    ...tinyPumpuang,
    current: {
      ...tinyPumpuang.current,
      location: {
        ...tinyPumpuang.current.location,
        coordinates: transformCoordinates(tinyPumpuang.current.location.coordinates),
      },
    },
  })) as PumpuangTiny[];

  return formattedTinyPumpuang;
};

// ----------------------------------------------------------------------

export const getProductTypes = async () => {
  const { data } = await axios.get<ApiResponse<ProductTypes[]>>(
    endpoints.commercials.pumpuang['product-types']
  );

  return data.data;
};

// ----------------------------------------------------------------------

export const getPumpuangById = async ({ queryKey }: Params) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, pumpuangId] = queryKey;

  // query data cannot be undefined
  if (pumpuangId === '') return null;

  const { data } = await axios.get<ApiResponse<Pumpuang>>(
    endpoints.commercials.pumpuang.detail(pumpuangId)
  );

  return data.data;
};

// ----------------------------------------------------------------------

export const getPumpuangRouteById = async ({ queryKey }: Params) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, pumpuangId] = queryKey;

  // query data cannot be undefined
  if (pumpuangId === '') return null;

  const { data: rawData } = await axios.get<ApiResponse<PumpuangDayHistory>>(
    endpoints.commercials.pumpuang.route(pumpuangId)
  );

  const { current, history } = rawData.data;

  const formattedRoute: PumpuangDayHistory = {
    ...rawData.data,
    current: {
      ...current,
      location: {
        type: 'Point',
        coordinates: transformCoordinates(current.location.coordinates),
      },
    },
    history: history.map((shortHistory) => ({
      ...shortHistory,
      coordinates: shortHistory.coordinates.map(transformCoordinates),
    })),
  };

  return formattedRoute;
};

// ----------------------------------------------------------------------

export const favoritePumpuang = async (pumpuangId: string) => {
  const { data } = await axios.post(endpoints.commercials.pumpuang.favorite(pumpuangId));

  return data.data;
};

// ----------------------------------------------------------------------

export const unfavoritePumpuang = async (pumpuangId: string) => {
  const { data } = await axios.delete(endpoints.commercials.pumpuang.unfavorite(pumpuangId));

  return data.data;
};

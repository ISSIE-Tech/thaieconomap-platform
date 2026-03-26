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

  const { data: rawData } = await axios.get<ApiResponse<PumpuangDayHistory[]>>(
    endpoints.commercials.pumpuang.route(pumpuangId)
  );

  const records = rawData.data;

  if (!records || !records.length) return null;

  // Use first record for current location (active tracking from Redis comes first)
  const firstRecord = records[0];
  // Flatten all records' history for complete polyline display
  const allHistory = records.flatMap((r) => r.history || []);

  const formattedRoute: PumpuangDayHistory = {
    ...firstRecord,
    current: {
      ...firstRecord.current,
      location: {
        type: 'Point',
        coordinates: transformCoordinates(firstRecord.current.location.coordinates),
      },
    },
    history: allHistory.map((shortHistory) => ({
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

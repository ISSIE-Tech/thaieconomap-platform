import type { CommercialType } from '../types';

import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

export const getRestaurantTypes = async (): Promise<CommercialType[]> => {
  const { data } = await axios.get<ApiResponse<CommercialType[]>>(endpoints.restaurant.types);

  return data.data;
};

// ----------------------------------------------------------------------

export const createRestaurantType = async (name: string) => {
  const { data } = await axios.post<ApiResponse<CommercialType>>(endpoints.restaurant.types, {
    name,
  });

  return data.data;
};

// ----------------------------------------------------------------------

export const deleteRestaurantType = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<null>>(`${endpoints.restaurant.types}/${id}`);

  return data.data;
};

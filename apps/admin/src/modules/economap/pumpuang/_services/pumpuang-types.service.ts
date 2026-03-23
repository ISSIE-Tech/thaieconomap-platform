import type { CommercialType } from '../../commercial/types';

import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

export const getPumpuangTypes = async () => {
  const { data } = await axios.get<ApiResponse<CommercialType[]>>(endpoints.pumpuang.types.list);

  return data.data;
};

// ----------------------------------------------------------------------

export const createPumpuangType = async (name: string) => {
  const { data } = await axios.post<ApiResponse<CommercialType>>(endpoints.pumpuang.types.create, {
    name,
  });

  return data.data;
};

// ----------------------------------------------------------------------

export const deletePumpuangType = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<null>>(endpoints.pumpuang.types.delete(id));

  return data.data;
};

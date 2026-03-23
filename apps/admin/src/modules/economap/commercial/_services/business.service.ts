import type { CommercialType } from '../types';

import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

export const getBusinessTypes = async (): Promise<CommercialType[]> => {
  const { data } = await axios.get<ApiResponse<CommercialType[]>>(endpoints.business.types);

  return data.data;
};

// ----------------------------------------------------------------------

type CreateBusinessTypeResponse = {
  data: CommercialType;
};

export const createBusinessType = async (name: string) => {
  const { data } = await axios.post<ApiResponse<CreateBusinessTypeResponse>>(
    endpoints.business.types,
    { name }
  );

  return data.data;
};

// ----------------------------------------------------------------------

export const deleteBusinessType = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<null>>(`${endpoints.business.types}/${id}`);

  return data.data;
};

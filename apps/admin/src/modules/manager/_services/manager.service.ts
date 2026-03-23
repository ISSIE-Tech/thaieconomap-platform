import type { ManagerItem, registerParams, registerDistrictsParams } from '../types';

import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

export const getManagerList = async () => {
  const { data } = await axios.get<ApiResponse<ManagerItem[]>>(endpoints.manager.list);

  return data.data;
};

export const registerManager = async (id: string, params: registerParams) => {
  const { data } = await axios.patch<ApiResponse<ManagerItem>>(
    endpoints.manager.register(id),
    params
  );

  return data;
};

export const registerManagerDistricts = async (id: string, params: registerDistrictsParams) => {
  const { data } = await axios.patch<ApiResponse<ManagerItem>>(
    endpoints.manager.districts(id),
    params
  );

  return data;
};

export const updateManagerProfile = async (params: FormData) => {
  const { data } = await axios.patch<ApiResponse<ManagerItem>>(endpoints.manager.update, params);

  return data;
};

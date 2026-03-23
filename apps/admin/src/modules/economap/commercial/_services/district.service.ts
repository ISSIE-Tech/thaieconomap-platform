import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

export type District = {
  _id: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtType: string;
  districtName: string;
  latitude: number;
  longitude: number;
};

// ----------------------------------------------------------------------

export const getDistricts = async (): Promise<District[]> => {
  const res = await axios.get<ApiResponse<District[]>>(endpoints.district.list);

  return res.data?.data;
};

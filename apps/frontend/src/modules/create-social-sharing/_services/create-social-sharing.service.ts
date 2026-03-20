import type { ApiResponse } from 'src/shared/types/api.type';

import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

import type { ShareOptions } from '../_types/create-social-sharing.type';

export const getShareTypes = async () => {
  const { data } = await axios.get<ApiResponse<ShareOptions[]>>(endpoints.shares.types);

  const formattedTypes: ShareOptions[] = data.data.map((type) => ({
    name: type.name,
    _id: type._id,
  }));

  return formattedTypes;
};

// -------------------------------------------------------------------------

export const getShareConditions = async () => {
  const { data } = await axios.get<ApiResponse<ShareOptions[]>>(endpoints.shares.conditions);

  const formattedConditions: ShareOptions[] = data.data
    .map((type) => ({
      name: type.name,
      _id: type._id,
    }))
    .sort((a, b) => {
      if (a.name === 'ต่ำกว่า 50%') return -1;
      if (a.name === '100%') return 1;

      return a.name.localeCompare(b.name);
    });

  return formattedConditions;
};

// -------------------------------------------------------------------------

export const createAdditionalImages = async (params: FormData) => {
  const res = await axios.post(endpoints.shares.uploadImg, params);

  return res.data;
};

// -------------------------------------------------------------------------

export const createPendingShares = async (params: FormData) => {
  const res = await axios.post(endpoints.shares.create, params);

  return res.data;
};

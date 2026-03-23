import type { SocialSharingItem, SocialSharingTypes } from '../types';

import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

export const getSocialSharings = async () => {
  const res = await axios.get<ApiResponse<SocialSharingItem[]>>(endpoints['social-sharing'].list);

  return res.data?.data;
};

// ----------------------------------------------------------------------

export const approveSocialSharing = async (id: string) => {
  const res = await axios.post(endpoints['social-sharing'].approve(id));

  return res.data;
};

// ----------------------------------------------------------------------

export const rejectSocialSharing = async (id: string, message: string) => {
  const res = await axios.post(endpoints['social-sharing'].reject(id), {
    submissionMessage: message,
  });

  return res.data;
};

// ----------------------------------------------------------------------

export const createSocialSharing = async (params: FormData) => {
  const res = await axios.post(endpoints['social-sharing'].create, params);

  return res.data;
};

// ----------------------------------------------------------------------

export const uploadSocialSharingAdditionalImage = async (params: FormData) => {
  const res = await axios.post(endpoints['social-sharing'].uploadImg, params);

  return res.data;
};

// ----------------------------------------------------------------------

export const getSocialSharingTypes = async () => {
  const res = await axios.get<ApiResponse<SocialSharingTypes[]>>(endpoints['social-sharing'].types);

  return res.data.data;
};
// ----------------------------------------------------------------------

export const getSocialSharingCondition = async () => {
  const res = await axios.get<ApiResponse<SocialSharingTypes[]>>(
    endpoints['social-sharing'].conditions
  );

  const formattedConditions = res.data.data
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

// ------------------------------------------------------------------------

export const createSocialSharingCondition = async (name: string) => {
  const { data } = await axios.post<ApiResponse<SocialSharingTypes[]>>(
    endpoints['social-sharing'].conditions,
    { name }
  );

  return data.data;
};

// ------------------------------------------------------------------------

export const deleteSocialSharingCondition = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<null>>(
    `${endpoints['social-sharing'].conditions}/${id}`
  );

  return data.data;
};

// ------------------------------------------------------------------------

export const updateSocialSharing = async (id: string, params: FormData) => {
  const res = await axios.put(endpoints['social-sharing'].update(id), params);

  return res.data;
};

// ------------------------------------------------------------------------

export const deleteSocialSharing = async (id: string) => {
  const res = await axios.delete(endpoints['social-sharing'].delete(id));

  return res.data;
};

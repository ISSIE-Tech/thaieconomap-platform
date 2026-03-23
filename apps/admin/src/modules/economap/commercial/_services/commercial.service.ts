import type { CommercialItem } from '../types';

import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

type GetCommercialsResponse = {
  data: CommercialItem[];
  // metaData: {
  //   count: number;
  //   perPage: number;
  //   currentPage: number;
  //   lastPage: number;
  //   prevPage: number | null;
  //   nextPage: number | null;
  // };
};

export const getCommercials = async (): Promise<GetCommercialsResponse> => {
  const res = await axios.get<ApiResponse<CommercialItem[]>>(endpoints.commercial.list);

  return res.data;
};

// ----------------------------------------------------------------------

export const approveCommercial = async (id: string) => {
  const res = await axios.post(endpoints.commercial.approve(id));

  return res.data;
};

// ----------------------------------------------------------------------

export const rejectCommercial = async (id: string, message: string) => {
  const res = await axios.post(endpoints.commercial.reject(id), {
    submissionMessage: message,
  });

  return res.data;
};

// ----------------------------------------------------------------------

export const deleteCommercial = async (id: string) => {
  const res = await axios.delete(endpoints.commercial.delete(id));

  return res.data;
};

// ----------------------------------------------------------------------

export const createAdditionalImages = async (params: FormData) => {
  const res = await axios.post(endpoints.commercial.uploadImg, params);

  return res.data;
};

// ----------------------------------------------------------------------

export const createCommercials = async (params: FormData) => {
  const res = await axios.post(endpoints.commercial.create, params);

  return res.data;
};

// ----------------------------------------------------------------------

export const updateCommercials = async (id: string, params: FormData) => {
  const res = await axios.put(endpoints.commercial.update(id), params);

  return res.data;
};

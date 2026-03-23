import type { PumpuangItem } from '../type';

import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

export const getPumpuangs = async () => {
  const res = await axios.get<ApiResponse<PumpuangItem[]>>(endpoints.pumpuang.list);

  return res.data;
};

// ----------------------------------------------------------------------

export const approvePumpuang = async (id: string) => {
  const res = await axios.post(endpoints.pumpuang.approve(id));

  return res.data;
};

// ----------------------------------------------------------------------

export const rejectPumpuang = async (id: string, message: string) => {
  const res = await axios.post(endpoints.pumpuang.reject(id), {
    submissionMessage: message,
  });

  return res.data;
};

// ----------------------------------------------------------------------

export const deletePumpuang = async (id: string) => {
  const res = await axios.delete(endpoints.pumpuang.delete(id));

  return res.data;
};

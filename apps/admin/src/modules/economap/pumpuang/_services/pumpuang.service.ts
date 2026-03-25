import type { PumpuangItem, PumpuangRouteResponse } from '../type';

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

// ----------------------------------------------------------------------

export const getPumpuang = async (id: string) => {
  const res = await axios.get<ApiResponse<PumpuangItem>>(endpoints.pumpuang.getById(id));
  return res.data;
};

// ----------------------------------------------------------------------

export const createPumpuang = async (params: FormData) => {
  const res = await axios.post(endpoints.pumpuang.create, params);
  return res.data;
};

// ----------------------------------------------------------------------

export const updatePumpuang = async (id: string, params: FormData) => {
  const res = await axios.put(endpoints.pumpuang.update(id), params);
  return res.data;
};

// ----------------------------------------------------------------------

export const getPumpuangRoute = async (id: string) => {
  const res = await axios.get<ApiResponse<PumpuangRouteResponse[]>>(endpoints.pumpuang.route(id));
  return res.data;
};

// ----------------------------------------------------------------------

export const uploadPumpuangAdditionalImage = async (params: FormData) => {
  const res = await axios.post(endpoints.pumpuang.uploadImg, params);
  return res.data;
};

// ----------------------------------------------------------------------

export const deletePumpuangAdditionalImage = async (id: string, fileName: string) => {
  const res = await axios.delete(endpoints.pumpuang.deleteImg(id), { params: { fileName } });
  return res.data;
};

// ----------------------------------------------------------------------

export const forceStopPumpuang = async (id: string) => {
  const res = await axios.post(endpoints.pumpuang.forceStop(id));
  return res.data;
};

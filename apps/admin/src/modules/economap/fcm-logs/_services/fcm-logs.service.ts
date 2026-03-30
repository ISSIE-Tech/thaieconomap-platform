import { endpoints } from 'src/configs/endpoints.config';
import type { ApiResponse } from 'src/types/api';

import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

export type FcmNotificationLog = {
  _id: string;
  sendTo: string;
  pumpuangName: string | null;
  status: 'success' | 'failure';
  reason: string;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FcmLogsResponse = {
  data: FcmNotificationLog[];
  total: number;
};

export type FcmLogsParams = {
  status?: string;
  sendTo?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

// ----------------------------------------------------------------------

export const getFcmLogs = async (params: FcmLogsParams): Promise<FcmLogsResponse> => {
  const res = await axios.get<ApiResponse<FcmLogsResponse>>(endpoints.notifications.logs, { params });

  return res.data.data;
};

// ----------------------------------------------------------------------

export const getTokenCounts = async (ids: string[]): Promise<Record<string, number>> => {
  if (ids.length === 0) return {};

  const res = await axios.post<ApiResponse<Record<string, number>>>(endpoints.notifications.tokenCounts, { ids });

  return res.data.data;
};

// ----------------------------------------------------------------------

export const testSendNotification = async (pumpuangId: string) => {
  const res = await axios.post(endpoints.notifications.testSend, { pumpuangId });

  return res.data;
};

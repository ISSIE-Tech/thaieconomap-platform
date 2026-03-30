import { endpoints } from 'src/configs/endpoints.config';
import type { ApiResponse } from 'src/types/api';

import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

export type OtpLogEntry = {
  _id: string;
  phoneNumber: string;
  pumpuangId: string;
  pumpuangName: string | null;
  action: 'request' | 'verify';
  status: 'success' | 'failure';
  refno: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OtpLogsResponse = {
  data: OtpLogEntry[];
  total: number;
};

export type OtpLogsParams = {
  action?: string;
  status?: string;
  phoneNumber?: string;
  from?: string;
  to?: string;
  page?: string;
  limit?: string;
};

// ----------------------------------------------------------------------

export const getOtpLogs = async (params: OtpLogsParams): Promise<OtpLogsResponse> => {
  const res = await axios.post<ApiResponse<OtpLogsResponse>>(endpoints.otp.logs, params);

  return res.data.data;
};

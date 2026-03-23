import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

import type { User } from 'src/types/user.type';
import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

export const getLineLoginUrl = async () => {
  const { data } = await axios.get<ApiResponse<string>>(endpoints.auth.line.link);

  const lineLoginUrl = data.data;

  return lineLoginUrl;
};

// ----------------------------------------------------------------------

type Credentials = {
  accessToken: string;
  refreshToken: string;
};

type LineLoginResponse = {
  credentials: Credentials;
  user: User;
};

export const lineLogin = async (authorizationCode: string) => {
  const { data } = await axios.post<ApiResponse<LineLoginResponse>>(endpoints.auth.line.login, {
    authorizationCode,
  });

  const { credentials, user } = data.data;

  return { credentials, user };
};

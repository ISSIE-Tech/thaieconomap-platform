import type { User } from 'src/types/user.type';
import type { ApiResponse } from 'src/types/api';

import axios from 'src/utils/axios';

import { endpoints } from 'src/configs/endpoints.config';

// ----------------------------------------------------------------------

export const getAuthentikLoginUrl = async () => {
  const { data } = await axios.get<ApiResponse<string>>(endpoints.auth.authentik.link);

  return data.data;
};

// ----------------------------------------------------------------------

type Credentials = {
  accessToken: string;
  refreshToken: string;
};

type AuthentikLoginResponse = {
  credentials: Credentials;
  user: User;
};

export const authentikLogin = async (authorizationCode: string) => {
  const { data } = await axios.post<ApiResponse<AuthentikLoginResponse>>(
    endpoints.auth.authentik.login,
    { authorizationCode }
  );

  const { credentials, user } = data.data;

  return { credentials, user };
};

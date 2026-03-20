import type { User } from 'src/types/user.type';
import type { ApiResponse } from 'src/types/api';

import axios from 'src/utils/axios';

import { endpoints } from 'src/configs/endpoints.config';

// ----------------------------------------------------------------------

export const getUserProfile = async () => {
  const { data } = await axios.get<ApiResponse<User>>(endpoints.auth.profile);

  return data;
};

import type { User } from 'src/shared/types/user.type';
import type { ApiResponse } from 'src/shared/types/api.type';

import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

// ----------------------------------------------------------------------

export const getUserProfile = async () => {
  const { data } = await axios.get<ApiResponse<User>>(endpoints.auth.profile.get);

  return data.data;
};

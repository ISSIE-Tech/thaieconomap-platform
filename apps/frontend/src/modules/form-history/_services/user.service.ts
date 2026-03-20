import type { ApiResponse } from 'src/shared/types/api.type';

import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

import type { FormHistory } from '../_types/history.type';

export const getUserHistory = async () => {
  const { data } = await axios.get<ApiResponse<FormHistory[]>>(endpoints.users.history);

  return data.data;
};

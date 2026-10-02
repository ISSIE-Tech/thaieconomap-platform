import type { ApiResponse } from 'src/shared/types/api.type';

import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

import { type FormHistory, SubmissionStatus } from '../_types/history.type';

export const getUserHistory = async () => {
  const { data } = await axios.get<ApiResponse<FormHistory[]>>(endpoints.users.history);

  return data.data;
};

// approved shops live in `commercials`; pending/rejected ones are still in `pending-commercials`
export const deleteMyShop = async (history: FormHistory) => {
  const url =
    history.submissionStatus === SubmissionStatus.ACCEPTED
      ? endpoints.commercials.delete(history._id)
      : endpoints.pendingCommercials.delete(history._id);

  await axios.delete(url);
};

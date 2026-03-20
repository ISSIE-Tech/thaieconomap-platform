import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

export const updatePendingCommercials = async (id: string, params: FormData) => {
  const res = await axios.put(endpoints.pendingCommercials.update(id), params);

  return res.data;
};

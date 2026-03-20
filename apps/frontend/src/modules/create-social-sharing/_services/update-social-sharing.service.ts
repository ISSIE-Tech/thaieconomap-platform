import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

export const updateSocialSharing = async (id: string, params: FormData) => {
  const res = await axios.put(endpoints.shares.update(id), params);

  return res.data;
};

import axios from 'src/utils/axios';

import { endpoints } from 'src/configs/endpoints.config';

export const updatePendingSocialSharing = async (id: string, params: FormData) => {
  const res = await axios.put(endpoints['pending-social-sharing'].update(id), params);

  return res.data;
};

// ----------------------------------------------------------------------

export const createAdditionalImages = async (params: FormData) => {
  const res = await axios.post(endpoints['pending-social-sharing'].uploadImg, params);

  return res.data;
};

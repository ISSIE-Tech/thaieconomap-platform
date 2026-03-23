import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

export const updatePendingCommercials = async (id: string, params: FormData) => {
  const res = await axios.put(endpoints['pending-commercial'].update(id), params);

  return res.data;
};

// ----------------------------------------------------------------------

export const createAdditionalImages = async (params: FormData) => {
  const res = await axios.post(endpoints['pending-commercial'].uploadImg, params);

  return res.data;
};

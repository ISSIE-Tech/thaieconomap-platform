import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

export const createAdditionalImages = async (params: FormData) => {
  const res = await axios.post(endpoints.commercials.uploadImg, params);

  return res.data;
};

// -------------------------------------------------------------------------

export const createPendingCommercials = async (params: FormData) => {
  const res = await axios.post(endpoints.pendingCommercials.create, params);

  return res.data;
};

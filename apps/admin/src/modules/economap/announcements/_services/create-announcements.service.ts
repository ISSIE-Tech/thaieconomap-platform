import type { AnnouncementItem } from '../types';

import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

type Params = {
  queryKey: string[];
};

export const createAnnouncements = async (params: FormData) => {
  const res = await axios.post(endpoints.announcements.create, params);

  return res.data;
};

// ----------------------------------------------------------------------

export const updateAnnouncements = async (id: string, params: FormData) => {
  const res = await axios.put(endpoints.announcements.update(id), params);

  return res.data;
};

// ----------------------------------------------------------------------

export const getAnnouncementsById = async ({ queryKey }: Params) => {
  const [, id] = queryKey;

  const res = await axios.get<ApiResponse<AnnouncementItem>>(endpoints.announcements.getById(id));

  return res.data.data;
};

// ----------------------------------------------------------------------

export const getAnnouncements = async () => {
  const res = await axios.get<ApiResponse<AnnouncementItem[]>>(endpoints.announcements.getAll);

  return res.data.data;
};

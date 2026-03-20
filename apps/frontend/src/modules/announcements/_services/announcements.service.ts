import type { ApiResponse } from 'src/shared/types/api.type';

import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

import type { Announcement, AnnouncementTiny } from '../_types/announcements.type';

type Params = {
  queryKey: string[];
};

// ----------------------------------------------------------------------

export const getTinyAnnouncements = async ({ queryKey }: Params) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, propKeys] = queryKey;

  // NOTE: propKeys include date, provinceId, district (id)
  // date=2024-11-11T17:19:52Z&provinceId=10&district=66506b632c35732f0159133f
  const params = `?${propKeys}`;
  const { data } = await axios.get<ApiResponse<AnnouncementTiny[]>>(
    endpoints.announcements.list(params)
  );

  return data.data;
};

// ----------------------------------------------------------------------

export const getAnnouncementById = async ({ queryKey }: Params) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, id] = queryKey;

  const { data } = await axios.get<ApiResponse<Announcement>>(endpoints.announcements.details(id));

  return data.data;
};

import { useQuery } from '@tanstack/react-query';

import { getAnnouncements } from '../_services/create-announcements.service';
import { ANNOUNCEMENT_QUERY_KEYS } from '../_configs/announcements-query-keys.config';

export const useGetAnnouncements = () =>
  useQuery({
    queryKey: [ANNOUNCEMENT_QUERY_KEYS.ANNOUNCEMENTS],
    queryFn: getAnnouncements,
  });

import { useQuery } from '@tanstack/react-query';

import { getAnnouncementsById } from '../_services/create-announcements.service';
import { ANNOUNCEMENT_QUERY_KEYS } from '../_configs/announcements-query-keys.config';

// ----------------------------------------------------------------------
type Props = {
  id: string;
};

export const useGetAnnouncementsById = ({ id }: Props) =>
  useQuery({
    queryKey: [ANNOUNCEMENT_QUERY_KEYS.ANNOUNCEMENTS, id],
    queryFn: getAnnouncementsById,
  });

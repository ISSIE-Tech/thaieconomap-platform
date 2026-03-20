import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getAnnouncementById } from '../_services/announcements.service';

type Props = {
  id: string;
};

const useGetAnnouncement = ({ id }: Props) =>
  useQuery({
    queryKey: [QUERY_KEY.ANNOUNCEMENTS, id],
    queryFn: getAnnouncementById,
  });

export default useGetAnnouncement;

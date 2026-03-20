import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getSharingById } from '../_services/sharing.service';

type Props = {
  sharingId: string;
  enabled?: boolean;
};

const useGetSharing = ({ sharingId, enabled }: Props) =>
  useQuery({
    queryKey: [QUERY_KEY.SHARES, sharingId],
    queryFn: getSharingById,
    enabled,
  });

export default useGetSharing;

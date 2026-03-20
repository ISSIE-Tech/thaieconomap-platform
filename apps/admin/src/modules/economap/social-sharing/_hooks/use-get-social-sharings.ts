import { useQuery } from '@tanstack/react-query';

import { getSocialSharings } from '../_services/social-sharing.service';
import { SOCIAL_SHARING_QUERY_KEYS } from '../_configs/social-sharing-query-keys.config';

// ----------------------------------------------------------------------

export const useGetSocialSharings = () =>
  useQuery({
    queryKey: [SOCIAL_SHARING_QUERY_KEYS.SOCIAL_SHARINGS],
    queryFn: getSocialSharings,
  });

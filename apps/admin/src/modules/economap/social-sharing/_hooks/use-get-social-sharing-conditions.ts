import { useQuery } from '@tanstack/react-query';

import { getSocialSharingCondition } from '../_services/social-sharing.service';
import { SOCIAL_SHARING_QUERY_KEYS } from '../_configs/social-sharing-query-keys.config';

// ----------------------------------------------------------------------

export const useGetSocialSharingConditions = () =>
  useQuery({
    queryKey: [SOCIAL_SHARING_QUERY_KEYS.SOCIAL_SHARINGS_CONDITIONS],
    queryFn: getSocialSharingCondition,
  });

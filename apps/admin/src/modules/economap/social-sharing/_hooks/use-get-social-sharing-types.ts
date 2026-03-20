import { useQuery } from '@tanstack/react-query';

import { getSocialSharingTypes } from '../_services/social-sharing.service';
import { SOCIAL_SHARING_QUERY_KEYS } from '../_configs/social-sharing-query-keys.config';

// ----------------------------------------------------------------------

export const useGetSocialSharingTypes = () =>
  useQuery({
    queryKey: [SOCIAL_SHARING_QUERY_KEYS.SOCIAL_SHARINGS_TYPES],
    queryFn: getSocialSharingTypes,
  });

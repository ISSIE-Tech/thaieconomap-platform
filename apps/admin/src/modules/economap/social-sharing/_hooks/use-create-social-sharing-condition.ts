import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { createSocialSharingCondition } from '../_services/social-sharing.service';
import { SOCIAL_SHARING_QUERY_KEYS } from '../_configs/social-sharing-query-keys.config';

import type { SocialSharingTypes } from '../types';

export const useCreateSocialSharingCondition = () =>
  useMutation({
    mutationFn: createSocialSharingCondition,
    onSuccess: (socialSharingCondition) =>
      queryClient.setQueryData(
        [SOCIAL_SHARING_QUERY_KEYS.SOCIAL_SHARINGS_CONDITIONS],
        (prev: SocialSharingTypes[]) => [...prev, socialSharingCondition]
      ),
  });

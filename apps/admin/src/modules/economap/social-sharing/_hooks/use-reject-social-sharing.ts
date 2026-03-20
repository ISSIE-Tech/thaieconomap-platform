import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { rejectSocialSharing } from '../_services/social-sharing.service';
import { SOCIAL_SHARING_QUERY_KEYS } from '../_configs/social-sharing-query-keys.config';

// ----------------------------------------------------------------------

type RejectSocialSharing = {
  id: string;
  message: string;
};

export const useRejectSocialSharing = () =>
  useMutation({
    mutationFn: ({ id, message }: RejectSocialSharing) => rejectSocialSharing(id, message),
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [SOCIAL_SHARING_QUERY_KEYS.SOCIAL_SHARINGS] });
      }
    },
  });

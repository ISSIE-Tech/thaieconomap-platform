import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { deleteSocialSharing } from '../_services/social-sharing.service';
import { SOCIAL_SHARING_QUERY_KEYS } from '../_configs/social-sharing-query-keys.config';

// ----------------------------------------------------------------------

export const useDeleteSocialSharing = () =>
  useMutation({
    mutationFn: deleteSocialSharing,
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [SOCIAL_SHARING_QUERY_KEYS.SOCIAL_SHARINGS] });
      }
    },
  });

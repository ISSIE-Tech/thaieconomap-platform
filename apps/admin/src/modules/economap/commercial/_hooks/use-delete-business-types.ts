import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { deleteBusinessType } from '../_services/business.service';
import { COMMERCIAL_QUERY_KEYS } from '../_configs/commercial-query-keys.config';

// ----------------------------------------------------------------------

export const useDeleteBusinessType = () =>
  useMutation({
    mutationFn: deleteBusinessType,
    onSettled: async (_, error) => {
      if (!error) {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: [COMMERCIAL_QUERY_KEYS.BUSINESS_TYPES] });
        }, 500);
      }
    },
  });

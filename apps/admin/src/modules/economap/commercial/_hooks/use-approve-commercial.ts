import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { approveCommercial } from '../_services/commercial.service';
import { COMMERCIAL_QUERY_KEYS } from '../_configs/commercial-query-keys.config';

// ----------------------------------------------------------------------

export const useApproveCommercial = () =>
  useMutation({
    mutationFn: (id: string) => approveCommercial(id),
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [COMMERCIAL_QUERY_KEYS.COMMERCIALS] });
      }
    },
  });

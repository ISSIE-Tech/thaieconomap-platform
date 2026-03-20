import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { deleteCommercial } from '../_services/commercial.service';
import { COMMERCIAL_QUERY_KEYS } from '../_configs/commercial-query-keys.config';

// ----------------------------------------------------------------------

export const useDeleteCommercial = () =>
  useMutation({
    mutationFn: deleteCommercial,
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [COMMERCIAL_QUERY_KEYS.COMMERCIALS] });
      }
    },
  });

import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { rejectCommercial } from '../_services/commercial.service';
import { COMMERCIAL_QUERY_KEYS } from '../_configs/commercial-query-keys.config';

// ----------------------------------------------------------------------

type RejectCommercial = {
  id: string;
  message: string;
};

export const useRejectCommercial = () =>
  useMutation({
    mutationFn: ({ id, message }: RejectCommercial) => rejectCommercial(id, message),
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [COMMERCIAL_QUERY_KEYS.COMMERCIALS] });
      }
    },
  });

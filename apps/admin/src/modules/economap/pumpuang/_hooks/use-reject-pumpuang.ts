import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { rejectPumpuang } from '../_services/pumpuang.service';
import { PUMPUANG_QUERY_KEYS } from '../_configs/pumpuang-query-keys.config';

// ----------------------------------------------------------------------

type RejectPumpuang = {
  id: string;
  message: string;
};

export const useRejectPumpuang = () =>
  useMutation({
    mutationFn: ({ id, message }: RejectPumpuang) => rejectPumpuang(id, message),
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [PUMPUANG_QUERY_KEYS.PUMPUANGS] });
      }
    },
  });

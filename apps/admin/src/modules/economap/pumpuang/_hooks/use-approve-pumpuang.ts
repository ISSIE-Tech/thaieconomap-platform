import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { approvePumpuang } from '../_services/pumpuang.service';
import { PUMPUANG_QUERY_KEYS } from '../_configs/pumpuang-query-keys.config';

// ----------------------------------------------------------------------

export const useApprovePumpuang = () =>
  useMutation({
    mutationFn: (id: string) => approvePumpuang(id),
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [PUMPUANG_QUERY_KEYS.PUMPUANGS] });
      }
    },
  });

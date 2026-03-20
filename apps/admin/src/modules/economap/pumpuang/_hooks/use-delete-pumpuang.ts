import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { deletePumpuang } from '../_services/pumpuang.service';
import { PUMPUANG_QUERY_KEYS } from '../_configs/pumpuang-query-keys.config';

// ----------------------------------------------------------------------

export const useDeletePumpuang = () =>
  useMutation({
    mutationFn: (id: string) => deletePumpuang(id),
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [PUMPUANG_QUERY_KEYS.PUMPUANGS] });
      }
    },
  });

import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { deletePumpuangType } from '../_services/pumpuang-types.service';
import { PUMPUANG_QUERY_KEYS } from '../_configs/pumpuang-query-keys.config';

// ----------------------------------------------------------------------

export const useDeletePumpuangType = () =>
  useMutation({
    mutationFn: deletePumpuangType,
    onSettled: async (_, error) => {
      if (!error) {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: [PUMPUANG_QUERY_KEYS.PUMPUANG_TYPES] });
        }, 500);
      }
    },
  });

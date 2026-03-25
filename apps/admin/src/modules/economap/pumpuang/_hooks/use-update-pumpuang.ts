import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { updatePumpuang } from '../_services/pumpuang.service';
import { PUMPUANG_QUERY_KEYS } from '../_configs/pumpuang-query-keys.config';

// ----------------------------------------------------------------------

export const useUpdatePumpuang = () =>
  useMutation({
    mutationFn: ({ id, params }: { id: string; params: FormData }) => updatePumpuang(id, params),
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [PUMPUANG_QUERY_KEYS.PUMPUANGS] });
      }
    },
  });

import type { registerParams } from '../types';

import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { registerManager } from '../_services/manager.service';
import { MANAGER_QUERY_KEYS } from '../_configs/manager-query-keys.config';

export const useRegisterManager = () =>
  useMutation({
    mutationFn: ({ id, params }: { id: string; params: registerParams }) =>
      registerManager(id, params),
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [MANAGER_QUERY_KEYS.MANAGERS] });
      }
    },
  });

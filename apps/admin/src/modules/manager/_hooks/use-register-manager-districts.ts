import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { registerManagerDistricts } from '../_services/manager.service';
import { MANAGER_QUERY_KEYS } from '../_configs/manager-query-keys.config';

import type { registerDistrictsParams } from '../types';

export const useRegisterManagerDistricts = () =>
  useMutation({
    mutationFn: ({ id, params }: { id: string; params: registerDistrictsParams }) =>
      registerManagerDistricts(id, params),
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [MANAGER_QUERY_KEYS.MANAGERS] });
      }
    },
  });

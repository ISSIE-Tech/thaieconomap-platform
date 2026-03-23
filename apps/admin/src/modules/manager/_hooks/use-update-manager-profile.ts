import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import type { EconomapError } from 'src/types/economap.type';

import { updateManagerProfile } from '../_services/manager.service';
import { MANAGER_QUERY_KEYS } from '../_configs/manager-query-keys.config';

const useUpdateManagerProfile = () =>
  useMutation({
    mutationFn: (params: FormData) => updateManagerProfile(params),
    onError: (error: EconomapError) => error,
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [MANAGER_QUERY_KEYS.MANAGERS] });
      }
    },
  });

export default useUpdateManagerProfile;

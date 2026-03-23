import type { CommercialType } from '../../commercial/types';

import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { createPumpuangType } from '../_services/pumpuang-types.service';
import { PUMPUANG_QUERY_KEYS } from '../_configs/pumpuang-query-keys.config';

// ----------------------------------------------------------------------

export const useCreatePumpuangType = () =>
  useMutation({
    mutationFn: createPumpuangType,
    onSuccess: (newPumpuangType) => {
      queryClient.setQueryData([PUMPUANG_QUERY_KEYS.PUMPUANG_TYPES], (prev: CommercialType[]) => [
        ...prev,
        newPumpuangType,
      ]);
    },
  });

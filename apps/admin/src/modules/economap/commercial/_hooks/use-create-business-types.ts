import type { CommercialType } from '../types';

import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { createBusinessType } from '../_services/business.service';
import { COMMERCIAL_QUERY_KEYS } from '../_configs/commercial-query-keys.config';

// ----------------------------------------------------------------------

export const useCreateBusinessType = () =>
  useMutation({
    mutationFn: createBusinessType,
    onSuccess: (newBusinessType) => {
      queryClient.setQueryData([COMMERCIAL_QUERY_KEYS.BUSINESS_TYPES], (prev: CommercialType[]) => [
        ...prev,
        newBusinessType,
      ]);
    },
  });

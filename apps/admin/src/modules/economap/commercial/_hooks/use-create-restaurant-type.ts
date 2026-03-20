import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { createRestaurantType } from '../_services/restaurant.service';
import { COMMERCIAL_QUERY_KEYS } from '../_configs/commercial-query-keys.config';

import type { CommercialType } from '../types';

// ----------------------------------------------------------------------

export const useCreateRestaurantType = () =>
  useMutation({
    mutationFn: createRestaurantType,
    onSuccess: (newRestaurantType) => {
      queryClient.setQueryData(
        [COMMERCIAL_QUERY_KEYS.RESTAURANT_TYPES],
        (prev: CommercialType[]) => [...prev, newRestaurantType]
      );
    },
  });

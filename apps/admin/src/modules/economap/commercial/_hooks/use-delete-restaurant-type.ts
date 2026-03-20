import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { deleteRestaurantType } from '../_services/restaurant.service';
import { COMMERCIAL_QUERY_KEYS } from '../_configs/commercial-query-keys.config';

// ----------------------------------------------------------------------

export const useDeleteRestaurantType = () =>
  useMutation({
    mutationFn: deleteRestaurantType,
    onSettled: async (_, error) => {
      if (!error) {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: [COMMERCIAL_QUERY_KEYS.RESTAURANT_TYPES] });
        }, 500);
      }
    },
  });

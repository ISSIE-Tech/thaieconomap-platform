import { useQuery } from '@tanstack/react-query';

import { getRestaurantTypes } from '../_services/restaurant.service';
import { COMMERCIAL_QUERY_KEYS } from '../_configs/commercial-query-keys.config';

// ----------------------------------------------------------------------

export const useGetRestaurantTypes = () =>
  useQuery({
    queryKey: [COMMERCIAL_QUERY_KEYS.RESTAURANT_TYPES],
    queryFn: getRestaurantTypes,
  });

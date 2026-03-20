import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getRestaurantTypes } from '../_services/commercial.service';

const useGetRestaurantTypes = () =>
  useQuery({
    queryKey: [QUERY_KEY.RESTAURANT_TYPES],
    queryFn: getRestaurantTypes,
  });

export default useGetRestaurantTypes;

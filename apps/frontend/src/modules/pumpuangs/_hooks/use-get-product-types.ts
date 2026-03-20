import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getProductTypes } from '../_services/pumpuangs.service';

const useGetProductTypes = () =>
  useQuery({
    queryKey: [QUERY_KEY.PRODUCT_TYPES],
    queryFn: getProductTypes,
  });

export default useGetProductTypes;

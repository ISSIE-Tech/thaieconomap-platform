import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getBusinessTypes } from '../_services/commercial.service';

const useGetBusinessTypes = () =>
  useQuery({
    queryKey: [QUERY_KEY.BUSINESS_TYPES],
    queryFn: getBusinessTypes,
  });

export default useGetBusinessTypes;

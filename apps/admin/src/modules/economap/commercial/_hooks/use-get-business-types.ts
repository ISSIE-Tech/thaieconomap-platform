import { useQuery } from '@tanstack/react-query';

import { getBusinessTypes } from '../_services/business.service';
import { COMMERCIAL_QUERY_KEYS } from '../_configs/commercial-query-keys.config';

// ----------------------------------------------------------------------

export const useGetBusinessTypes = () =>
  useQuery({
    queryKey: [COMMERCIAL_QUERY_KEYS.BUSINESS_TYPES],
    queryFn: getBusinessTypes,
  });

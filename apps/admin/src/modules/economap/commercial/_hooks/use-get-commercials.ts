import { useQuery } from '@tanstack/react-query';

import { getCommercials } from '../_services/commercial.service';
import { COMMERCIAL_QUERY_KEYS } from '../_configs/commercial-query-keys.config';

// ----------------------------------------------------------------------

export const useGetCommercials = () =>
  useQuery({
    queryKey: [COMMERCIAL_QUERY_KEYS.COMMERCIALS],
    queryFn: getCommercials,
  });

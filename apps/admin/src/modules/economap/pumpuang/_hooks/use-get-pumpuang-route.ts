import { useQuery } from '@tanstack/react-query';

import { getPumpuangRoute } from '../_services/pumpuang.service';
import { PUMPUANG_QUERY_KEYS } from '../_configs/pumpuang-query-keys.config';

// ----------------------------------------------------------------------

export const useGetPumpuangRoute = (id: string) =>
  useQuery({
    queryKey: [PUMPUANG_QUERY_KEYS.PUMPUANG_ROUTE, id],
    queryFn: () => getPumpuangRoute(id),
    enabled: !!id,
  });

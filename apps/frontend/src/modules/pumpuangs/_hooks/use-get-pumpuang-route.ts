import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getPumpuangRouteById } from '../_services/pumpuangs.service';

const useGetPumpuangRouteById = (pumpuangId: string) =>
  useQuery({
    queryKey: [QUERY_KEY.PUMPUANG_ROUTE, pumpuangId],
    queryFn: getPumpuangRouteById,
    enabled: pumpuangId !== '',
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });

export default useGetPumpuangRouteById;

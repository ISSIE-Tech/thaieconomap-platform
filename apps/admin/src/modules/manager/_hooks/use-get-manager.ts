import { useQuery } from '@tanstack/react-query';

import { getManagerList } from '../_services/manager.service';
import { MANAGER_QUERY_KEYS } from '../_configs/manager-query-keys.config';

// ----------------------------------------------------------------------

export const useGetManagers = () =>
  useQuery({
    queryKey: [MANAGER_QUERY_KEYS.MANAGERS],
    queryFn: getManagerList,
  });

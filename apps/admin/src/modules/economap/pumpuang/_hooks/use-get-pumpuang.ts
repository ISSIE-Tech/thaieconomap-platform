import { useQuery } from '@tanstack/react-query';

import { getPumpuang } from '../_services/pumpuang.service';
import { PUMPUANG_QUERY_KEYS } from '../_configs/pumpuang-query-keys.config';

// ----------------------------------------------------------------------

export const useGetPumpuang = (id: string) =>
  useQuery({
    queryKey: [PUMPUANG_QUERY_KEYS.PUMPUANG, id],
    queryFn: () => getPumpuang(id),
    enabled: !!id,
  });

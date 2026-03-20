import { useQuery } from '@tanstack/react-query';

import { getPumpuangs } from '../_services/pumpuang.service';
import { PUMPUANG_QUERY_KEYS } from '../_configs/pumpuang-query-keys.config';

// ----------------------------------------------------------------------

export const useGetPumpuangs = () =>
  useQuery({
    queryKey: [PUMPUANG_QUERY_KEYS.PUMPUANGS],
    queryFn: getPumpuangs,
  });

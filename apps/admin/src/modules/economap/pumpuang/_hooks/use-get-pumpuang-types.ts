import { useQuery } from '@tanstack/react-query';

import { getPumpuangTypes } from '../_services/pumpuang-types.service';
import { PUMPUANG_QUERY_KEYS } from '../_configs/pumpuang-query-keys.config';

// ----------------------------------------------------------------------

export const useGetPumpuangTypes = () =>
  useQuery({
    queryKey: [PUMPUANG_QUERY_KEYS.PUMPUANG_TYPES],
    queryFn: getPumpuangTypes,
  });

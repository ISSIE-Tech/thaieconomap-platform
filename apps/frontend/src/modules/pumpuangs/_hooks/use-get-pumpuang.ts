import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getPumpuangById } from '../_services/pumpuangs.service';

const useGetPumpuangById = (pumpuangId: string, enabled: boolean = true) =>
  useQuery({
    queryKey: [QUERY_KEY.PUMPUANG, pumpuangId],
    queryFn: getPumpuangById,
    enabled: enabled ?? pumpuangId !== '',
  });

export default useGetPumpuangById;

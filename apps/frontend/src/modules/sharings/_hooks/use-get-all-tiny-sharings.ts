import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getTinySharings } from '../_services/sharing.service';

const useGetAllTinySharings = () =>
  useQuery({
    queryKey: [QUERY_KEY.SHARES_ALL],
    queryFn: getTinySharings,
  });

export default useGetAllTinySharings;

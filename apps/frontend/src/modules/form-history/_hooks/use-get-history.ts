import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getUserHistory } from '../_services/user.service';

const useGetHistory = () =>
  useQuery({
    queryKey: [QUERY_KEY.HISTORY],
    queryFn: getUserHistory,
  });

export default useGetHistory;

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getShareConditions } from '../_services/create-social-sharing.service';

const useGetConditions = () =>
  useQuery({
    queryKey: [QUERY_KEY.GET_CONDITIONS],
    queryFn: getShareConditions,
  });

export default useGetConditions;

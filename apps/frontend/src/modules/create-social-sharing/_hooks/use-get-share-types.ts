import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getShareTypes } from '../_services/create-social-sharing.service';

const useGetShareTypes = () =>
  useQuery({
    queryKey: [QUERY_KEY.GET_SHARE_TYPES],
    queryFn: getShareTypes,
  });

export default useGetShareTypes;

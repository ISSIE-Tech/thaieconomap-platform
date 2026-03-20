import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getTinyCommercials } from '../_services/commercial.service';

const useGetTinyCommercials = () =>
  useQuery({
    queryKey: [QUERY_KEY.COMMERCIALS],
    queryFn: getTinyCommercials,
  });

export default useGetTinyCommercials;

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getTinyFavorites } from '../_services';

const useGetTinyFavorites = () =>
  useQuery({
    queryKey: [QUERY_KEY.FAVORITES],
    queryFn: getTinyFavorites,
  });

export default useGetTinyFavorites;

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getTinyFilteredSharings } from '../_services/sharing.service';

type Props = {
  location?: string;
  latitude?: string;
  longitude?: string;
  status?: string;
  name?: string;
  district?: string;
  types?: string;
};

const useGetTinySharings = ({ ...props }: Props) => {
  // ex: location:100,latitude:13,longitude:14,district:6612345
  const propKeys = Object.entries(props)
    .map(([key, value]) => `${key}:${value}`)
    .join(',');

  return useQuery({
    queryKey: [QUERY_KEY.SHARES, propKeys],
    queryFn: getTinyFilteredSharings,
  });
};

export default useGetTinySharings;

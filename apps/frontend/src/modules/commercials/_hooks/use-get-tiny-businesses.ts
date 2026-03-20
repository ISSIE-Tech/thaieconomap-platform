import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getTinyFilteredCommercials } from '../_services/commercial.service';

type Props = {
  location?: string;
  workingHour?: string;
  latitude?: string;
  longitude?: string;
  types?: string;
};

const useGetTinyBusinesses = ({ ...props }: Props) => {
  // ex: location=100&latitude=13&longitude=14&types=6612345
  const propKeys = Object.entries(props)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return useQuery({
    queryKey: [QUERY_KEY.COMMERCIALS, QUERY_KEY.CATEGORY.BUSINESS, propKeys],
    queryFn: getTinyFilteredCommercials,
  });
};

export default useGetTinyBusinesses;

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/configs/query-keys.config';
import { getDistricts } from 'src/modules/economap/commercial/_services/district.service';

export const useGetDistricts = () =>
  useQuery({
    queryKey: [QUERY_KEYS.DISTRICTS],
    queryFn: getDistricts,
  });

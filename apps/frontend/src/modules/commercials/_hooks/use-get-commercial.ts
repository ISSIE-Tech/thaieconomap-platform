import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '../_config';
import { getCommercialById } from '../_services/commercial.service';

type Props = {
  commercialId: string;
  enabled?: boolean;
};

const useGetCommercial = ({ commercialId, enabled }: Props) =>
  useQuery({
    queryKey: [QUERY_KEY.COMMERCIALS, commercialId],
    queryFn: getCommercialById,
    enabled,
  });

export default useGetCommercial;

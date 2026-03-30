import { useQuery } from '@tanstack/react-query';

import { FCM_LOGS_QUERY_KEYS } from '../_configs/fcm-logs-query-keys.config';
import { getTokenCounts } from '../_services/fcm-logs.service';

export const useGetTokenCounts = (ids: string[]) =>
  useQuery({
    queryKey: [FCM_LOGS_QUERY_KEYS.TOKEN_COUNTS, ids],
    queryFn: () => getTokenCounts(ids),
    enabled: ids.length > 0,
  });

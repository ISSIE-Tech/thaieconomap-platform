import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { FCM_LOGS_QUERY_KEYS } from '../_configs/fcm-logs-query-keys.config';
import { getFcmLogs, type FcmLogsParams } from '../_services/fcm-logs.service';

export const useGetFcmLogs = (params: FcmLogsParams) =>
  useQuery({
    queryKey: [FCM_LOGS_QUERY_KEYS.FCM_LOGS, params],
    queryFn: () => getFcmLogs(params),
    placeholderData: keepPreviousData,
  });

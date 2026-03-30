import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { OTP_LOGS_QUERY_KEYS } from '../_configs/otp-logs-query-keys.config';
import { getOtpLogs, type OtpLogsParams } from '../_services/otp-logs.service';

export const useGetOtpLogs = (params: OtpLogsParams) =>
  useQuery({
    queryKey: [OTP_LOGS_QUERY_KEYS.OTP_LOGS, params],
    queryFn: () => getOtpLogs(params),
    placeholderData: keepPreviousData,
  });

import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/components/react-query';

import { FCM_LOGS_QUERY_KEYS } from '../_configs/fcm-logs-query-keys.config';
import { testSendNotification } from '../_services/fcm-logs.service';

export const useTestSendNotification = () =>
  useMutation({
    mutationFn: (pumpuangId: string) => testSendNotification(pumpuangId),
    onSettled: async (_, error) => {
      if (!error) {
        queryClient.invalidateQueries({ queryKey: [FCM_LOGS_QUERY_KEYS.FCM_LOGS] });
      }
    },
  });

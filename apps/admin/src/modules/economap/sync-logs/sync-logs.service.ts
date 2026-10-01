import { endpoints } from 'src/configs/endpoints.config';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

export type SyncSource = 'tamsang' | 'csc';

export type SyncLogEntry = {
  _id: string;
  trigger: 'cron' | 'manual';
  triggeredBy: string | null;
  status: 'success' | 'failure';
  shopsReceived: number;
  shopsSaved: number;
  basesSaved: number;
  jobsReceived: number;
  jobsSaved: number;
  jobCategoriesSaved: number;
  durationMs: number;
  errorMessage: string | null;
  createdAt: string;
};

type Paginated<T> = { data: T[]; total: number };

const SYNC_ENDPOINT: Record<SyncSource, string> = {
  tamsang: endpoints.caching.sync,
  csc: endpoints.caching.cscJobsSync,
};

export const SYNC_LOGS_QUERY_KEY = 'sync-logs';

// ----------------------------------------------------------------------

export const useGetSyncLogs = (source: SyncSource, params: { page: string; limit: string }) =>
  useQuery({
    queryKey: [SYNC_LOGS_QUERY_KEY, source, params],
    queryFn: async () =>
      (
        await axios.post<ApiResponse<Paginated<SyncLogEntry>>>(endpoints.caching.syncLogs, {
          ...params,
          source,
        })
      ).data.data,
    placeholderData: keepPreviousData,
  });

// Refresh the history whether the sync worked or not - a failure still adds a row.
// invalidateKeys lets a page refresh the list the sync fed as well.
export const useSync = (source: SyncSource, invalidateKeys: string[] = []) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => axios.post(SYNC_ENDPOINT[source]),
    onSettled: () =>
      Promise.all(
        [SYNC_LOGS_QUERY_KEY, ...invalidateKeys].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] })
        )
      ),
  });
};

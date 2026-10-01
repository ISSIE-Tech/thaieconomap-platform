import { endpoints } from 'src/configs/endpoints.config';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

export type TamsangShop = {
  _id: string;
  sourceId: string;
  name: string;
  type: string;
  category: string;
  imageUrl?: string;
  address?: string;
  commercialOwner: string;
  phoneNumber?: string;
  base?: { _id: string; name?: string } | null;
  hidden?: boolean;
};

export type SyncLogEntry = {
  _id: string;
  trigger: 'cron' | 'manual';
  triggeredBy: string | null;
  status: 'success' | 'failure';
  shopsReceived: number;
  shopsSaved: number;
  basesSaved: number;
  durationMs: number;
  errorMessage: string | null;
  createdAt: string;
};

type Paginated<T> = { data: T[]; total: number };

type ListParams = { page: string; limit: string; search?: string };

const QUERY_KEYS = {
  SHOPS: 'tamsang-shops',
  SYNC_LOGS: 'tamsang-sync-logs',
};

// ----------------------------------------------------------------------

export const useGetTamsangShops = (params: ListParams) =>
  useQuery({
    queryKey: [QUERY_KEYS.SHOPS, params],
    queryFn: async () =>
      (await axios.post<ApiResponse<Paginated<TamsangShop>>>(endpoints.caching.shops, params)).data
        .data,
    placeholderData: keepPreviousData,
  });

export const useGetSyncLogs = (params: ListParams) =>
  useQuery({
    queryKey: [QUERY_KEYS.SYNC_LOGS, params],
    queryFn: async () =>
      (await axios.post<ApiResponse<Paginated<SyncLogEntry>>>(endpoints.caching.syncLogs, params))
        .data.data,
    placeholderData: keepPreviousData,
  });

// Refresh both lists whether the sync worked or not - a failure still adds a history row.
export const useSyncTamsangShops = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => axios.post(endpoints.caching.sync),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHOPS] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SYNC_LOGS] }),
      ]),
  });
};

export const useSetTamsangShopHidden = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
      axios.patch(endpoints.caching.shopHidden(id), { hidden }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHOPS] }),
  });
};

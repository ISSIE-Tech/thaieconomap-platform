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

export type TamsangBase = {
  _id: string;
  sourceId: string;
  name?: string;
  botInfo?: { basicId: string; displayName: string; lineImageUrl: string };
  location?: { coordinates: [number, number] } | null;
  serviceRadiusKm?: number;
  hidden?: boolean;
};

type Paginated<T> = { data: T[]; total: number };

type ListParams = { page: string; limit: string; search?: string };

export const TAMSANG_SHOPS_QUERY_KEY = 'tamsang-shops';

// ----------------------------------------------------------------------

export const useGetTamsangShops = (params: ListParams) =>
  useQuery({
    queryKey: [TAMSANG_SHOPS_QUERY_KEY, params],
    queryFn: async () =>
      (await axios.post<ApiResponse<Paginated<TamsangShop>>>(endpoints.caching.shops, params)).data
        .data,
    placeholderData: keepPreviousData,
  });

export const useGetTamsangBases = () =>
  useQuery({
    queryKey: [TAMSANG_SHOPS_QUERY_KEY, 'bases'],
    queryFn: async () =>
      (await axios.post<ApiResponse<TamsangBase[]>>(endpoints.caching.bases)).data.data,
  });

export const useSetTamsangShopHidden = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
      axios.patch(endpoints.caching.shopHidden(id), { hidden }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: [TAMSANG_SHOPS_QUERY_KEY] }),
  });
};

// Hides the whole node: every shop under it and its service-area popup.
export const useSetTamsangBaseHidden = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
      axios.patch(endpoints.caching.baseHidden(id), { hidden }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: [TAMSANG_SHOPS_QUERY_KEY] }),
  });
};

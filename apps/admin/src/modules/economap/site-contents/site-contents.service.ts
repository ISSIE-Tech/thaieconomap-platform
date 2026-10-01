import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

export type SiteContentKey = 'about' | 'terms' | 'privacy';

export type SiteContentStrings = Record<string, { th: string; en: string }>;

type SiteContent = { key: SiteContentKey; strings: SiteContentStrings; updatedAt: string | null };

const url = (key: SiteContentKey) => `/services/thai-economap/site-contents/${key}`;

// ----------------------------------------------------------------------

export const useGetSiteContent = (key: SiteContentKey) =>
  useQuery({
    queryKey: ['site-content', key],
    queryFn: async () => (await axios.get<ApiResponse<SiteContent>>(url(key))).data.data,
  });

export const useUpdateSiteContent = (key: SiteContentKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (strings: SiteContentStrings) =>
      (await axios.put<ApiResponse<SiteContent>>(url(key), { strings })).data.data,
    onSuccess: (data) => queryClient.setQueryData(['site-content', key], data),
  });
};

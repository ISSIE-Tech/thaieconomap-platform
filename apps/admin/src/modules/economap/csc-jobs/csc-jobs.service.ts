import { endpoints } from 'src/configs/endpoints.config';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import axios from 'src/utils/axios';

import type { ApiResponse } from 'src/types/api';

// ----------------------------------------------------------------------

export type CscJob = {
  _id: string;
  mark: {
    title: string;
    category?: { _id: string; name: string } | null;
    // GeoJSON is [longitude, latitude]
    location?: { coordinates: [number, number] } | null;
  };
  hidden?: boolean;
};

type ListParams = { page: string; limit: string; search?: string };

export const CSC_JOBS_QUERY_KEY = 'csc-jobs';

// ----------------------------------------------------------------------

export const useGetCscJobs = (params: ListParams) =>
  useQuery({
    queryKey: [CSC_JOBS_QUERY_KEY, params],
    queryFn: async () =>
      (
        await axios.post<ApiResponse<{ data: CscJob[]; total: number }>>(
          endpoints.caching.cscJobs,
          params
        )
      ).data.data,
    placeholderData: keepPreviousData,
  });

export const useSetCscJobHidden = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
      axios.patch(endpoints.caching.cscJobHidden(id), { hidden }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: [CSC_JOBS_QUERY_KEY] }),
  });
};

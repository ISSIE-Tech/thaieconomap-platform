import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateJob } from '../_services/csc.service';
import { CSC_QUERY_KEYS } from '../_configs/csc-query-keys.config';

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: FormData }) => updateJob(id, params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CSC_QUERY_KEYS.JOBS] }),
  });
};

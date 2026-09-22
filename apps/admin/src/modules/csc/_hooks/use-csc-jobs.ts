import type { JobKind } from '../types';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useCscRole } from './use-csc-role';
import { CSC_QUERY_KEYS } from '../_configs/csc-query-keys.config';
import {
  getJobs,
  rejectJob,
  getJobById,
  approveJob,
  recycleJob,
  restoreJob,
  destroyJob,
} from '../_services/csc.service';

export const useGetJobs = (kind: JobKind) => {
  const { isAdmin } = useCscRole();

  return useQuery({
    queryKey: [CSC_QUERY_KEYS.JOBS, kind, isAdmin],
    queryFn: () => getJobs(kind, isAdmin),
  });
};

export const useGetJobById = (kind: JobKind, id: string) =>
  useQuery({
    queryKey: [CSC_QUERY_KEYS.JOBS, kind, id],
    queryFn: () => getJobById(kind, id),
  });

export type JobAction = 'recycle' | 'approve' | 'reject' | 'restore' | 'destroy';

const ACTIONS: Record<JobAction, (id: string, rejectMessage: string) => Promise<unknown>> = {
  recycle: recycleJob,
  approve: approveJob,
  reject: rejectJob,
  restore: restoreJob,
  destroy: destroyJob,
};

// every action moves a post between lists, so invalidate all of them
export const useJobAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action, id, rejectMessage = '' }: { action: JobAction; id: string; rejectMessage?: string }) =>
      ACTIONS[action](id, rejectMessage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CSC_QUERY_KEYS.JOBS] }),
  });
};

import type { CscUser, CscUserRole } from '../types';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CSC_QUERY_KEYS } from '../_configs/csc-query-keys.config';
import {
  getCscUsers,
  getCscDistricts,
  updateCscUserRole,
  updateCscUserDistricts,
} from '../_services/csc.service';

export const useGetCscUsers = () =>
  useQuery({ queryKey: [CSC_QUERY_KEYS.USERS], queryFn: getCscUsers });

export const useGetCscDistricts = () =>
  useQuery({ queryKey: [CSC_QUERY_KEYS.DISTRICTS], queryFn: getCscDistricts, staleTime: Infinity });

export const useUpdateCscUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role, districts }: { user: CscUser; role: CscUserRole; districts: string[] }) => {
      if (role !== user.role) {
        await updateCscUserRole(user.shortId, role);
      }
      await updateCscUserDistricts(user, districts);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CSC_QUERY_KEYS.USERS] }),
  });
};

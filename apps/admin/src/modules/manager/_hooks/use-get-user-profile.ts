import { useQuery } from '@tanstack/react-query';

import { getUserProfile } from 'src/auth/services/user.service';

import { MANAGER_QUERY_KEYS } from '../_configs/manager-query-keys.config';

export const useGetUserProfile = () =>
  useQuery({
    queryKey: [MANAGER_QUERY_KEYS.USER_PROFILE],
    queryFn: getUserProfile,
  });

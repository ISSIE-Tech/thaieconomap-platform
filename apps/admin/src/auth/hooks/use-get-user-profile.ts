import { useMutation } from '@tanstack/react-query';

import { getUserProfile } from '../services/user.service';

// ----------------------------------------------------------------------

export const useGetUserProfile = () =>
  useMutation({
    mutationFn: getUserProfile,
  });

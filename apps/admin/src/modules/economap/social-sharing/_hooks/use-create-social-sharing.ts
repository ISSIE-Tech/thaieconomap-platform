import { useMutation } from '@tanstack/react-query';

import type { EconomapError } from 'src/types/economap.type';

import { createSocialSharing } from '../_services/social-sharing.service';

const useCreateSocialSharing = () =>
  useMutation({
    mutationFn: (params: FormData) => createSocialSharing(params),
    onError: (error: EconomapError) => error,
  });

export default useCreateSocialSharing;

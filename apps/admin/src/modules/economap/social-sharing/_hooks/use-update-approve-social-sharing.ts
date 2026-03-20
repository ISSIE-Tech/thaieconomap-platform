import type { EconomapError } from 'src/types/economap.type';

import { useMutation } from '@tanstack/react-query';

import { updateSocialSharing } from '../_services/social-sharing.service';

const useUpdateSocialSharing = () =>
  useMutation({
    mutationFn: ({ id, params }: { id: string; params: FormData }) =>
      updateSocialSharing(id, params),
    onError: (error: EconomapError) => error,
  });

export default useUpdateSocialSharing;

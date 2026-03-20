import type { EconomapError } from 'src/types/economap.type';

import { useMutation } from '@tanstack/react-query';

import { createAdditionalImages } from '../_services/pending-social-sharing.service';

const useCreatePendingAdditionalImage = () =>
  useMutation({
    mutationFn: (params: FormData) => createAdditionalImages(params),
    onError: (error: EconomapError) => error,
  });

export default useCreatePendingAdditionalImage;

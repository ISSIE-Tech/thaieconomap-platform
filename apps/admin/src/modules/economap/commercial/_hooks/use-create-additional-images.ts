import type { EconomapError } from 'src/types/economap.type';

import { useMutation } from '@tanstack/react-query';

import { createAdditionalImages } from '../_services/commercial.service';

const useCreateAdditionalImage = () =>
  useMutation({
    mutationFn: (params: FormData) => createAdditionalImages(params),
    onError: (error: EconomapError) => error,
  });

export default useCreateAdditionalImage;

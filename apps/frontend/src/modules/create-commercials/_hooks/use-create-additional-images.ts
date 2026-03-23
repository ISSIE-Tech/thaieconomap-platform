import type { CommercialError } from '../_types/create-commercials.type';

import { useMutation } from '@tanstack/react-query';

import { createAdditionalImages } from '../_services/create-commercials.service';

const useCreateAdditionalImage = () =>
  useMutation({
    mutationFn: (params: FormData) => createAdditionalImages(params),
    onSuccess: (res) => res,
    onError: (error: CommercialError) => error,
  });

export default useCreateAdditionalImage;
